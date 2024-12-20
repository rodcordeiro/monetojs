import { AppDataSource } from '../index';
import { DwellersEntity } from '../entities/dwellers.entity';
import { DwellersLogEntity } from '../entities/DwellerLogs.entity';
import { BuildEntity } from '../entities/builds.entity';
import { JobsEntity } from '../entities/jobs.entity';
import { AssignmentEntity } from '../entities/assignment.entity';

export const DwellersRepository = AppDataSource.getRepository(DwellersEntity);
export const DwellersLogRepository =
  AppDataSource.getRepository(DwellersLogEntity);
export const BuildRepository = AppDataSource.getRepository(BuildEntity);
export const JobsRepository = AppDataSource.getRepository(JobsEntity);
export const AssignmentRepository =
  AppDataSource.getRepository(AssignmentEntity);
