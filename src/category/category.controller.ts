import {Body, Controller, Get, Param, Patch, Post, Query, UseInterceptors,} from '@nestjs/common';
import {CategoryService} from './category.service';
import {ApiQuery} from '@nestjs/swagger';
import {CategoryDto, PatchCategoryDto} from './category.dto';
import {plainToInstance} from 'class-transformer';
import {CategoryEntity} from './category.entity';
import {BusinessErrorsInterceptor} from '../shared/interceptors/business-errors.interceptor';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('categories')
export class CategoryController {
  constructor(private service: CategoryService) {}

  @Get()
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'relations', required: false })
  async find(
    @Query('categoryId') id?: string,
    @Query('name') name?: string,
    @Query('relations') relations = true,
  ) {
    if (id || name) {
      return await this.service.findOne({ where: { id, name }, relations });
    } else {
      return await this.service.findAll();
    }
  }

  @Post()
  async create(@Body() categoryDto: CategoryDto) {
    const categoryEntity = plainToInstance(CategoryEntity, categoryDto);
    categoryEntity.products = [];
    return await this.service.createCategory(categoryEntity);
  }

  @Patch(':categoryId')
  async edit(
    @Body() categoryDto: PatchCategoryDto,
    @Param('categoryId') id?: string,
  ) {
    return await this.service.editCategory(id, categoryDto);
  }
}
