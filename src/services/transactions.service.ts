import { cleanReturned } from '../common/helpers/cleaner.helper';
import { TransactionsEntity, UserEntity } from '../database/entities';
import {
  AccountRepository,
  CategoryRepository,
} from '../database/repositories';
import { TransactionsRepository } from '../database/repositories/transactions.repository';

export class TransactionsServices {
  static async findOwns(
    user: UserEntity,
    options?: { category?: string; account?: string },
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
    if (options?.category) {
      qb.andWhere('b.uuid = :category', {
        category: options.category,
      });
    }

    if (options?.account) {
      qb.andWhere('c.uuid = :account', {
        account: options.account,
      });
    }

    qb.orderBy('a.date', 'DESC').skip(0).take(15);

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
      date: new Date().toISOString(),
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
}
