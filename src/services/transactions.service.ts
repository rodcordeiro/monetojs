import { SelectQueryBuilder } from 'typeorm';
import { cleanReturned } from '../common/helpers/cleaner.helper';
import { TransactionsEntity, UserEntity } from '../database/entities';
import {
  AccountRepository,
  CategoryRepository,
} from '../database/repositories';
import { TransactionsRepository } from '../database/repositories/transactions.repository';
import { randomUUID } from 'crypto';

export class TransactionsServices {
  static async findOwns(
    user: UserEntity,
    filters?: (qb: SelectQueryBuilder<TransactionsEntity>) => void,
  ) {
    const qb = TransactionsRepository.createQueryBuilder('a');

    qb.select([
      'a.id',
      'a.description',
      'a.date',
      'a.value',
      'a.batchId',
      'a.category',
      'a.account',
    ]);
    qb.leftJoinAndSelect('a.category', 'b', 'a.category = b.id');
    qb.leftJoinAndSelect('a.account', 'c', 'a.account = c.id');
    if (filters) {
      filters(qb);
    }

    qb.andWhere('a.owner = :owner', {
      owner: user.id,
    });
    return await qb.getMany();
  }
  static async create(data: TransactionsEntity, user: UserEntity) {
    const details = TransactionsRepository.create(data);
    const account = await AccountRepository.findOneByOrFail({
      uuid: data.account.toString(),
    });
    const category = await CategoryRepository.findOneByOrFail({
      uuid: data.category.toString(),
    });
    const transaction = await TransactionsRepository.save({
      ...details,
      date: data.date
        ? new Date(data.date).toISOString()
        : new Date().toISOString(),
      account: account.id,
      category: category.id,
      owner: user.id,
    });
    await AccountRepository.update(account.id, {
      ammount: account.ammount + data.value * (category.positive ? 1 : -1),
    });
    return cleanReturned({
      ...transaction,
      category: category.name,
      account: account.name,
      owner: user.name,
    });
  }
  static async createTransfer(
    origin: string,
    destiny: string,
    description: string,
    value: number,
    owner: number,
    date?: Date,
  ) {
    const originAccount = await AccountRepository.findOneByOrFail({
      uuid: origin,
      owner,
    });
    const destinyAccount = await AccountRepository.findOneByOrFail({
      uuid: destiny,
      owner,
    });
    const originCategory = await CategoryRepository.findOneByOrFail({
      transferOrigin: true,

      owner,
    });
    const destinyCategory = await CategoryRepository.findOneByOrFail({
      transferDestination: true,
      owner,
    });
    const batchId = randomUUID();
    const originTransaction = TransactionsRepository.create({
      description: description,
      value: value,
      batchId,
      owner: owner,
      category: originCategory.id,
      account: originAccount.id,
      date: date || new Date().toISOString(),
    } as TransactionsEntity);
    const destinyTransaction = TransactionsRepository.create({
      description: description,
      value: value,
      batchId,
      owner: owner,
      category: destinyCategory.id,
      account: destinyAccount.id,
      date: date || new Date().toISOString(),
    } as TransactionsEntity);
    originAccount.ammount -= value;
    destinyAccount.ammount += value;
    await TransactionsRepository.save([originTransaction, destinyTransaction]);
    await AccountRepository.save([originAccount, destinyAccount]);
  }
}
