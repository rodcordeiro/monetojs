import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { UserEntity } from './user.entity';

export enum CategoryClassification {
  /** Required transactions, like rental payments and monthly bills */
  Duty = 'duty',
  /** Necessary transactions, like food or medical bills */
  Necessary = 'necessary',
  /** Non necessary expenses, like a gift for someone */
  Wish = 'wish',
}

@Entity({ name: `${process.env.KEY_TABLE_NAME}_categories`.toUpperCase() })
export class CategoryEntity extends BaseEntity {
  /** Columns */
  @Column({type:'varchar'})
  name!: string;

  @Column({type:'varchar'})
  icon?: string;

  @Column({
    type: 'bool',
  })
  positive!: boolean;

  @Column({
    type: 'bool',
    comment:
      'Internal category, like transfer between accounts. Not to be used in reports.',
    default: false,
  })
  internal!: boolean;

  @Column({
    type: 'bool',
    comment:
      'A transient category is a category that holds transactions pending to be correctly categorized',
    default: false,
  })
  transient!: boolean;

  @Column({
    type: 'bool',
    comment:
      'Indicates if the category is a parent (grouper) category. A grouper category acts as a container for subcategories and does not hold transactions directly.',
    default: false,
  })
  grouper!: boolean;

  @Column({
    type: 'enum',
    comment: 'Category classification between duty, necessary and wish. ',
    enum: CategoryClassification,
  })
  classification?: CategoryClassification;

  /** Joins */
  @ManyToOne(() => UserEntity, {
    eager: false,
    nullable: false,
  })
  @JoinColumn({
    name: 'owner',
    referencedColumnName: 'id',
  })
  owner!: number;

  @ManyToOne(() => CategoryEntity, (category) => category.subcategories, {
    nullable: true,
  })
  @JoinColumn({
    name: 'category',
    referencedColumnName: 'id',
  })
  parentCategory?: number;

  @OneToMany(() => CategoryEntity, (category) => category.parentCategory, {
    nullable: true,
  })
  subcategories?: CategoryEntity[];

  /** Methods */
}
