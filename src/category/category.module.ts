import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './category.entity';
import { ProductEntity } from '../product/product.entity';

@Module({
  providers: [CategoryService],
  controllers: [CategoryController],
  exports: [CategoryService],
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
})
export class CategoryModule {}
