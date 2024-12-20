import { AppDataSource } from '../index';
import { UserEntity } from '../entities/user.entity';

export const UserRepository = AppDataSource.getRepository(UserEntity);
