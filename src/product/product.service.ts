import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from 'src/shared/errors';
import { Repository } from 'typeorm';
import { ProductEntity } from './product.entity';
import { QueryFailedError } from 'typeorm';
import { S3Service } from '../shared/aws/storage.service';
import { CreateProductDto } from './product.dto';
import { CategoryService } from '../category/category.service';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private storageService: S3Service,
    private categoryService: CategoryService,
  ) {}

  async findAll(
    skip = 0,
    relations: boolean,
    take?: number,
  ): Promise<ProductEntity[]> {
    let options: object = { skip, relations: relations ? ['categories'] : [] };
    if (take) {
      options = { ...options, take: take };
    }
    return await this.productRepository.find(options);
  }

  async findOne(id: string, relations: boolean): Promise<ProductEntity> {
    let product: ProductEntity | undefined = undefined;
    try {
      product = await this.productRepository.findOne({
        where: { id: id },
        relations: relations ? ['categories'] : [],
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

  async create(createProductDto: CreateProductDto) {
    const base64Data: string = createProductDto.img_base64_data;
    const categoriesEntities = [];
    let [img_url, key] = [
      'https://kiranametro.com/admin/public/size_primary_images/no-image.jpg',
      undefined,
    ];

    for (const catName of createProductDto.categories) {
      try {
        const cat = await this.categoryService.findOne({
          where: { name: catName },
        });
        categoriesEntities.push(cat);
      } catch (e) {}
    }
    if (base64Data) {
      try {
        [img_url, key] = base64Data
          ? await this.storageService.uploadImage(base64Data)
          : [img_url, undefined];
      } catch (e) {
        if (e instanceof BusinessLogicException) {
          throw e;
        }
      }
    }

    const productObj = {
      ...createProductDto,
      img_url,
      categories: categoriesEntities,
    };
    delete productObj.img_base64_data;
    const productEntity: ProductEntity = plainToInstance(
      ProductEntity,
      productObj,
    );
    try {
      return await this.productRepository.save(productEntity);
    } catch (e: any) {
      if (key) {
        await this.storageService.deleteImage(key);
      }

      if (e instanceof QueryFailedError) {
        throw new BusinessLogicException(e.message, BusinessError.BAD_REQUEST);
      } else {
        throw new BusinessLogicException(e.message, BusinessError.BAD_REQUEST);
      }
    }
  }

  async delete(productId: string) {
    const product = await this.findOne(productId, false);
    await this.productRepository.remove(product);
  }
}
