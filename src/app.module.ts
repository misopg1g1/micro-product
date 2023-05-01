import { Module } from '@nestjs/common';
// import {TypeOrmModule} from '@nestjs/typeorm';
import { dbConfig } from './shared/config/dbconfig';
import { HealthcheckModule } from './healthcheck/healthcheck.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { ProductEntity } from './product/product.entity';
import { CategoryEntity } from './category/category.entity';

function getDBConfig() {
  return { ...dbConfig, entities: [ProductEntity, CategoryEntity] };
}
@Module({
  imports: [
    TypeOrmModule.forRoot(getDBConfig()),
    HealthcheckModule,
    ProductModule,
    CategoryModule,
  ],
})
export class AppModule {}
