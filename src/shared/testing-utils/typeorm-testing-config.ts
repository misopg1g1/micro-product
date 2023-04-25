import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from 'src/product/product.entity';
import { dbConfig } from '../config/dbconfig';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    ...dbConfig,
    dropSchema: true,
    entities: [ProductEntity],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([ProductEntity]),
];
