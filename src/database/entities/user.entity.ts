import { Entity } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entity';

@Entity({ name: 'TB_USERS' })
export class UserEntity extends BaseEntity {
  /** COLUMNS */
  name?: string;
}
