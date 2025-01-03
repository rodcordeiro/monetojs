import { AppDataSource } from '../index';
import { ObjectivesEntity } from '../entities';

export const ObjectivesRepository =
  AppDataSource.getRepository(ObjectivesEntity);
