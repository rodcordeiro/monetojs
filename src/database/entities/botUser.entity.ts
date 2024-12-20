import { Entity, Column, JoinColumn, OneToOne } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'tb_bot_user' })
export class BotUserEntity extends BaseEntity {
  /** COLUMNS */
  @Column({ type: 'varchar' })
  discord_id!: string;
  /** JOINS */
  @OneToOne(() => UserEntity, {
    onUpdate: 'SET NULL',
    onDelete: 'SET NULL',
    eager: true,
  })
  @JoinColumn({ name: 'owner', referencedColumnName: 'id' })
  owner?: number;
}
