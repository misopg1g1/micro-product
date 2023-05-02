import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProductType } from './product.entity';
import { Transform } from 'class-transformer';

function getOldestStringDate() {
  const d = new Date(0);
  return d.toISOString();
}

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ default: '' })
  @IsString()
  @IsOptional()
  dimensions = '';

  @ApiProperty({ default: 'PERISHABLE' })
  @IsEnum(ProductType)
  type: ProductType;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  temperature_control = 0;

  @ApiProperty({ default: getOldestStringDate() })
  @IsString()
  @IsOptional()
  expiration_date: string = getOldestStringDate();

  @ApiProperty()
  @IsString()
  @IsOptional()
  fragility_conditions = '';

  @ApiProperty()
  @IsString()
  @IsOptional()
  description = '';

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  status = true;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  img_base64_data = '';

  @ApiProperty()
  @IsString()
  @IsOptional()
  suppliers = '';

  @ApiProperty()
  @IsArray()
  @IsOptional()
  categories: string[] = [];

  constructor(partial: Partial<CreateProductDto> = {}) {
    Object.assign(this, partial);
    this.expiration_date = this.expiration_date ?? getOldestStringDate(); // default value
    this.dimensions = '';
    this.temperature_control = 0;
    this.fragility_conditions = '';
    this.description = '';
    this.status = true;
    this.img_base64_data = '';
    this.suppliers = '';
    this.categories = [];
  }
}

export class GetProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ default: '' })
  @IsString()
  @IsOptional()
  dimensions = '';

  @ApiProperty({ default: 'PERISHABLE' })
  @IsEnum(ProductType)
  type: ProductType;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  temperature_control = 0;

  @ApiProperty({ default: getOldestStringDate() })
  @IsString()
  @IsOptional()
  expiration_date: string = getOldestStringDate();

  @ApiProperty()
  @IsString()
  @IsOptional()
  fragility_conditions = '';

  @ApiProperty()
  @IsString()
  @IsOptional()
  description = '';

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  status = true;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  img_base64_data = '';

  @ApiProperty()
  @IsString()
  @IsOptional()
  suppliers = '';

  @ApiProperty()
  @IsArray()
  @IsOptional()
  categories: string[] = [];
}
