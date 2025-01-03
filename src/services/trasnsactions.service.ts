import { cleanReturned } from '../common/helpers/cleaner.helper';
import {
  BotUserEntity,
  TransactionsEntity,
  UserEntity,
} from '../database/entities';
import {
  AccountRepository,
  CategoryRepository,
} from '../database/repositories';
import { TransactionsRepository } from '../database/repositories/transactions.repository';

export class TransactionsServices {
  static async findOwns(owner: BotUserEntity) {
    const qb = TransactionsRepository.createQueryBuilder('transaction');

    return await qb
      .where('transaction.owner = :owner', {
        owner: (owner.owner as unknown as UserEntity).id,
      })
      .getMany();
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
      date: new Date().toISOstring(),
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
