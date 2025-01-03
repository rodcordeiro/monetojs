import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { UserEntity } from './user.entity';
import { CategoryEntity } from './category.entity';
import { AccountEntity } from './account.entity';

@Entity({ name: `tb_transactions`.toUpperCase() })
export class TransactionsEntity extends BaseEntity {
  /** Columns */

  @Column({ type: 'varchar' })
  description!: string;

  @Column({ type: 'datetime' })
  date!: string;

  @Column({
    type: 'double',
  })
  value!: number;

  @Column({
    name: 'batch_id',
    nullable: true,
    type: 'varchar',
  })
  batchId?: string;

  /** Joins */
  @ManyToOne(() => UserEntity, {
    eager: false,
    nullable: false,
    cascade: ['soft-remove'],
  })
  @JoinColumn({
    name: 'owner',
    referencedColumnName: 'id',
  })
  owner!: number | string;

  @ManyToOne(() => CategoryEntity, {
    eager: true,
    nullable: false,
    cascade: ['soft-remove'],
  })
  @JoinColumn({
    name: 'category',
    referencedColumnName: 'id',
  })
  category!: number | string;

  @ManyToOne(() => AccountEntity, {
    eager: true,
    nullable: false,
    cascade: ['soft-remove'],
  })
  @JoinColumn({
    name: 'account',
    referencedColumnName: 'id',
  })
  account!: number | string;

  // @ManyToOne(() => ObjectivesEntity, {
  //   eager: true,
  //   nullable: true,
  //   cascade: ['soft-remove'],
  // })
  // @JoinColumn({
  //   name: 'objective',
  //   referencedColumnName: 'id',
  // })
  // objective?: number | string;

  /** Methods */
}
