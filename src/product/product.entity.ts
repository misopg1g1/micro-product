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
function getOldestStringDate() {
  const d = new Date(0);
  return d.toISOString();
}
@Entity()
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ default: uuidv4() })
  sku: string;

  @Column({ default: '' })
  dimensions: string;

  @Column('varchar')
  type: ProductType;

  @Column({ nullable: true })
  temperature_control: number;

  @Column({ default: getOldestStringDate(), nullable: true })
  expiration_date: Date;

  @Column({ default: '', nullable: true })
  fragility_conditions: string;

  @Column({ default: '', nullable: true })
  description: string;

  @Column({ default: true, nullable: true })
  status: boolean;

  @Column()
  price: number;

  @Column({ default: '', nullable: true })
  img_url: string;

  @Column({ default: '', nullable: true })
  suppliers: string;

  @ManyToMany(() => CategoryEntity, (category) => category.products)
  @JoinTable()
  categories: CategoryEntity[];

  @BeforeInsert()
  generateSKU() {
    this.sku = uuidv4();
  }
}
