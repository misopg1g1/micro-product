import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CategoryEntity } from '../category/category.entity';
import { v4 as uuidv4 } from 'uuid';

export enum ProductType {
  PERISHABLE = 'PERISHABLE',
  NONPERISHABLE = 'NONPERISHABLE',
}

@Entity()
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  sku: string;

  @Column()
  dimensions: string;

  @Column('varchar')
  type: ProductType;

  @Column()
  temperature_control: number;

  @Column()
  expiration_date: Date;

  @Column()
  fragility_conditions: string;

  @Column()
  description: string;

  @Column()
  status: boolean;

  @Column()
  price: number;

  @Column()
  img_url: string;

  @Column()
  suppliers: string;

  @ManyToMany(() => CategoryEntity, (category) => category.products)
  @JoinTable()
  categories: CategoryEntity[];

  @BeforeInsert()
  generateSKU() {
    this.sku = uuidv4();
  }
}
