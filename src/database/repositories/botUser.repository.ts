import { BotUserEntity } from '../entities/botUser.entity';
import { AppDataSource } from '../index';

export const BotUserRepository = AppDataSource.getRepository(BotUserEntity);
