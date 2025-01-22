import { UserEntity } from '../database/entities';
import { CategoryRepository } from '../database/repositories/category.repository';

export class CategoriesServices {
  static async findOwns(owner: UserEntity) {
    const qb = CategoryRepository.createQueryBuilder('category');
    return await qb
      .leftJoinAndSelect('category.subcategories', 'subcategory')
      .where('category.category IS NULL')
      .andWhere(`category.owner = ${owner.id}`)
      .getMany();
    // return await qb
      // .where('category.owner = :owner', {
      //   owner: owner.id,
      // })
      // .getMany();
  }
}
