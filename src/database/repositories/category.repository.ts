import { AppDataSource } from '../index';
import { CategoryEntity } from '../entities/category.entity';

export const CategoryRepository = AppDataSource.getRepository(CategoryEntity);
