import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductEntity } from '../product/product.entity';

@Entity()
export class CategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column({ default: true })
  status: boolean;

  @ManyToMany(() => ProductEntity, (product) => product.categories)
  products: ProductEntity[];
}
