import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProductType } from './product.entity';

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
  dimensions?: string;

  @ApiProperty({ default: 'PERISHABLE' })
  @IsEnum(ProductType)
  type: ProductType;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  temperature_control?: number;

  @ApiProperty({ default: getOldestStringDate() })
  @IsString()
  @IsOptional()
  expiration_date?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  fragility_conditions?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ default: true })
  @IsBoolean()
  @IsOptional()
  status?: boolean;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  img_base64_data?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  suppliers?: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  categories?: string[];

  constructor(partial: Partial<CreateProductDto>) {
    Object.assign(this, partial);
    this.dimensions = this.dimensions ?? '';
    this.temperature_control = this.temperature_control ?? 0;
    this.expiration_date = this.expiration_date ?? getOldestStringDate();
    this.fragility_conditions = this.fragility_conditions ?? '';
    this.description = this.description ?? '';
    this.status = this.status ?? true;
    this.img_base64_data = this.img_base64_data ?? '';
    this.suppliers = this.suppliers ?? '';
    this.categories = this.categories ?? [];
  }
}
