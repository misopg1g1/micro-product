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
  dimensions: string = '';

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
  @IsArray()
  @IsOptional()
  suppliers: string[] = [];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  categories: string[] = [];
}

export class GetProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  dimensions: string;

  @IsEnum(ProductType)
  type: ProductType;

  @IsNumber()
  @IsNotEmpty()
  temperature_control = 0;

  @IsString()
  @IsNotEmpty()
  expiration_date: string;

  @IsString()
  @IsNotEmpty()
  fragility_conditions: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  @IsNotEmpty()
  status: boolean;

  @IsNumber()
  price: number;

  @IsString()
  @IsNotEmpty()
  img_url: string;

  @IsArray()
  @IsOptional()
  @Transform((dimensions) => {
    const reg = new RegExp('("|{|})', 'g');
    return dimensions.value.replace(reg, '').split(',');
  })
  suppliers: string[];

  @IsArray()
  categories: any[];
}
