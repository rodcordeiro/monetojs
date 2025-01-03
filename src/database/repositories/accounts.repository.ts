import { AppDataSource } from '../index';
import { AccountEntity } from '../entities/account.entity';

export const AccountRepository = AppDataSource.getRepository(AccountEntity);
