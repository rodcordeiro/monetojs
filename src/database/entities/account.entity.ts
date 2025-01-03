import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { PaymentEntity } from './payment.entity';
import { UserEntity } from './user.entity';

@Entity({ name: `TB_accounts`.toUpperCase() })
export class AccountEntity extends BaseEntity {
  /** COLUMNS */
  @Column({ type: 'varchar' })
  name!: string;

  @Column({
    type: 'double',
  })
  ammount!: number;

  @Column({
    type: 'double',
  })
  threshold?: number;

  /** JOIN COLUMNS */
  @ManyToOne(() => PaymentEntity, {
    eager: true,
    nullable: false,
    cascade: ['soft-remove'],
  })
  @JoinColumn({
    name: 'paymentType',
    referencedColumnName: 'id',
  })
  paymentType!: number;

  @ManyToOne(() => UserEntity, {
    eager: false,
    nullable: false,
  })
  @JoinColumn({
    name: 'owner',
    referencedColumnName: 'id',
  })
  owner!: number;
}
