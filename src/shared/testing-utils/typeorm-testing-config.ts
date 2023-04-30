import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from 'src/product/product.entity';
import { dbConfig } from '../config/dbconfig';
import { CategoryEntity } from '../../category/category.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    // ...dbConfig,
    type: 'sqlite',
    database: ':memory:',
    entities: [ProductEntity, CategoryEntity],
    dropSchema: true,
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([ProductEntity, CategoryEntity]),
];
