import { Get, Injectable, Post } from '@nestjs/common';
import {
  EntityMetadataNotFoundError,
  QueryFailedError,
  Repository,
} from 'typeorm';
import { CategoryEntity } from './category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';
import { PatchCategoryDto } from './category.dto';
import { BusinessError, BusinessLogicException } from '../shared/errors';
import { IsBoolean } from 'class-validator';

interface QueryOptions {
  where: {
    id?: string;
    name?: string;
  };
  relations?: boolean;
}
@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private repository: Repository<CategoryEntity>,
  ) {}

  async findAll() {
    try {
      return await this.repository.find();
    } catch (e) {
      if (e instanceof EntityMetadataNotFoundError) {
        return [];
      } else {
        throw new BusinessLogicException(
          'Servicio no disponible actualmente',
          BusinessError.BAD_REQUEST,
        );
      }
    }
  }

  async findOne(options: QueryOptions) {
    const where = {};
    for (const prop in options.where) {
      if (options.where[prop]) {
        where[prop] = options.where[prop];
      }
    }
    return await this.repository.findOne({
      where: where,
      relations: options.relations ? ['products'] : [],
    });
  }

  async createCategory(category: CategoryEntity) {
    try {
      return await this.repository.save(category);
    } catch (e) {
      if (e instanceof QueryFailedError) {
        throw new BusinessLogicException(
          'Ya existe una categoria con ese nombre',
          BusinessError.BAD_REQUEST,
        );
      }
    }
  }

  async editCategory(id: string, category: PatchCategoryDto) {
    const storedCategory = await this.repository.findOne({ where: { id } });
    for (const prop in category) {
      if (category[prop] || typeof category[prop] === 'boolean') {
        storedCategory[prop] = category[prop];
      }
    }
    return await this.repository.save(storedCategory);
  }
}
