import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from 'src/product/product.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'postgres',
    //host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'postgres',
    dropSchema: true,
    entities: [ProductEntity],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([ProductEntity]),
];
