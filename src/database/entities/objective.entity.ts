import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { UserEntity } from './user.entity';

@Entity({ name: `tb_objectives`.toUpperCase() })
export class ObjectivesEntity extends BaseEntity {
  /** Columns */
  @Column({ type: 'varchar' })
  title!: string;

  /** Objective description */
  @Column({ type: 'varchar', nullable: true })
  description?: string;

  /** Current objective ammount */
  @Column({
    type: 'double',
    default: 0,
    comment: 'Current objective ammount',
  })
  ammount?: number;

  /** Objective value aimed. Allows empty value, since an objective dont have always a previous target value */
  @Column({
    type: 'double',
    nullable: true,
  })
  target?: number;

  /** Estimated time *(in months)* which the objective must be concluded */
  @Column({
    type: 'int',
    nullable: true,
  })
  estimated_months?: number;

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

  // @OneToMany(() => TransactionsEntity, (transaction) => transaction.objective, {
  //   nullable: true,
  //   cascade: ['soft-remove'],
  // })
  // @JoinTable({
  //   name: `${process.env.KEY_TABLE_NAME}_objectives_transactions`,
  // })
  // transactions?: TransactionsEntity[];

  /** Methods */
}
