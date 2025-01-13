import { cleanReturned } from '../common/helpers/cleaner.helper';
import { AccountEntity, UserEntity } from '../database/entities';
import { PaymentTypeRepository } from '../database/repositories';
import { AccountRepository } from '../database/repositories/accounts.repository';

export class AccountsServices {
  static async findOwns(owner: UserEntity) {
    const qb = AccountRepository.createQueryBuilder('account');

    return await qb
      .where('account.owner = :owner', {
        owner: owner.id,
      })
      .getMany();
  }
  static async listPaymentTypes() {
    return (await PaymentTypeRepository.find()).map((i) => ({
      name: i.name,
      value: i.uuid,
    }));
  }
  static async create(data: AccountEntity, user: UserEntity) {
    const details = AccountRepository.create(data);
    const paymentType = await PaymentTypeRepository.findOneByOrFail({
      uuid: data.paymentType.toString(),
    });
    const transaction = await AccountRepository.save({
      ...details,
      paymentType: paymentType.id,
      owner: user.id,
    });

    return cleanReturned({
      ...transaction,
      owner: user.name,
    });
  }
}
