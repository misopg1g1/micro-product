import { Module } from '@nestjs/common';
// import {TypeOrmModule} from '@nestjs/typeorm';
import { dbConfig } from './shared/config/dbconfig';
import { HealthcheckModule } from './healthcheck/healthcheck.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';

@Module({
  imports: [TypeOrmModule.forRoot(dbConfig), HealthcheckModule, ProductModule],
})
export class AppModule {}
