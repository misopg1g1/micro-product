import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { ProductService } from './product.service';
import { ApiQuery } from '@nestjs/swagger';
import { CreateProductDto } from './product.dto';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  @ApiQuery({ name: 'relations', required: false, type: Boolean || String })
  async findAll(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('relations') relations: any = false,
  ) {
    let transformedRelations = relations;
    if (typeof relations === 'string') {
      transformedRelations = JSON.parse(relations.toLowerCase());
    }
    return await this.productService.findAll(skip, transformedRelations, take);
  }

  @Get(':productId')
  @ApiQuery({ name: 'relations', required: false, type: Boolean })
  async findOne(
    @Param('productId') productId: string,
    @Query('relations') relations: any = false,
  ) {
    let transformedRelations = relations;
    if (typeof relations === 'string') {
      transformedRelations = JSON.parse(relations.toLowerCase());
    }
    const product = await this.productService.findOne(
      productId,
      transformedRelations,
    );
    return product;
  }

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productService.create(createProductDto);
  }

  @Delete(':productId')
  @HttpCode(204)
  async delete(@Param('productId') productId: string) {
    await this.productService.delete(productId);
  }
}
