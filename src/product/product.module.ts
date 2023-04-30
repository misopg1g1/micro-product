import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from 'src/product/product.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { CategoryService } from '../category/category.service';
import { S3Service } from '../shared/aws/storage.service';
import { ConfigService } from '@nestjs/config';
import { CategoryEntity } from '../category/category.entity';

@Module({
  providers: [ProductService, CategoryService, S3Service, ConfigService],
  imports: [TypeOrmModule.forFeature([ProductEntity, CategoryEntity])],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
