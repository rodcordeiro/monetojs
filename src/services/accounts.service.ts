import { BotUserEntity, UserEntity } from '../database/entities';
import { AccountRepository } from '../database/repositories/accounts.repository';

export class AccountsServices {
  static async findOwns(owner: BotUserEntity) {
    const qb = AccountRepository.createQueryBuilder('account');

    return await qb
      .where('account.owner = :owner', {
        owner: (owner.owner as unknown as UserEntity).id,
      })
      .getMany();
  }
}
