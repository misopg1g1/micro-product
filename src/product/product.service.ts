import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from 'src/shared/errors';
import { Repository } from 'typeorm';
import { ProductEntity } from './product.entity';
import { QueryFailedError } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async findAll(skip = 0, take?: number): Promise<ProductEntity[]> {
    let options: object = { skip };
    if (take) {
      options = { ...options, take: take };
    }
    return await this.productRepository.find(options);
  }

  async findOne(id: string): Promise<ProductEntity> {
    let product: ProductEntity | undefined = undefined;
    try {
      product = await this.productRepository.findOne({
        where: { id: id },
      });
    } catch (e) {
      if (e instanceof QueryFailedError) {
        throw new BusinessLogicException(e.message, BusinessError.BAD_REQUEST);
      }
    }
    if (!product) {
      throw new BusinessLogicException(
        'El producto con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    }
    return product;
  }
}
