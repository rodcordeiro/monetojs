import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity({ name: `TB_payments`.toUpperCase() })
export class PaymentEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  name!: string;
}
