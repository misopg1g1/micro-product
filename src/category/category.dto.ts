import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @ApiProperty({ default: true })
  @IsBoolean()
  @IsOptional()
  readonly status: boolean = true;
}

export class PatchCategoryDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly description: string;

  @ApiProperty({ default: true })
  @IsBoolean()
  @IsOptional()
  readonly status: boolean = true;
}
