import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
  /** COLUMNS */
  @PrimaryGeneratedColumn()
  @Generated('increment')
  id!: number;

  @Column({
    unique: true,
    type: 'varchar',
  })
  @Generated('uuid')
  uuid!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date | null;

  /** == METHODS =============== */
  @BeforeInsert()
  updateCreatedAt() {
    this.createdAt = new Date();

    this.createdAt.setHours(this.createdAt.getHours() - 3);
  }

  @BeforeUpdate()
  updateUpdatedAt() {
    this.updatedAt = new Date();

    this.updatedAt.setHours(this.createdAt!.getHours() - 3);
  }

  // updateDeletedAt() {
  //   this.deletedAt = new Date();
  //   this.deletedAt.setHours(this.deletedAt.getHours() - 3);
  // }
}
