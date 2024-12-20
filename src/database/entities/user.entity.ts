import { Entity, Column } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entity';

@Entity({ name: 'tb_bot_user' })
export class UserEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  discord_id!: string;
}
