import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

enum ProductType {
  PERISHABLE = 'PERISHABLE',
  NONPERISHABLE = 'NONPERISHABLE',
}

interface Category {
  name: string;
  description: string;
  status: boolean;
}

@Entity()
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  sku: string;

  @Column('int', { array: true })
  array: number[];

  @Column('int', { array: true })
  type: ProductType[];

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

  @Column('json', { nullable: true })
  category: Record<string, any>;
}
