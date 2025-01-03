import { BotUserEntity, UserEntity } from '../database/entities';
import { CategoryRepository } from '../database/repositories/category.repository';

export class CategoriesServices {
  static async findOwns(owner: BotUserEntity) {
    const qb = CategoryRepository.createQueryBuilder('category');

    return await qb
      .where('category.owner = :owner', {
        owner: (owner.owner as unknown as UserEntity).id,
      })
      .getMany();
  }
}
