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

  async create(createProductDto: CreateProductDto) {
    const base64Data: string = createProductDto.img_base64_data;
    const suppliers = createProductDto.suppliers.join(' | ');
    const categoriesEntities = [];
    let img_url =
      'https://kiranametro.com/admin/public/size_primary_images/no-image.jpg';

    for (const catName of createProductDto.categories) {
      try {
        const cat = await this.categoryService.findOne({
          where: { name: catName },
        });
        categoriesEntities.push(cat);
      } catch (e) {}
    }
    try {
      img_url = base64Data
        ? await this.storageService.uploadImage(base64Data)
        : img_url;
    } catch (e) {
      if (e instanceof BusinessLogicException) {
        throw e;
      }
    }

    const productObj = {
      ...createProductDto,
      img_url,
      suppliers,
      categories: categoriesEntities,
    };
    delete productObj.img_base64_data;
    const productEntity = plainToInstance(ProductEntity, productObj);
    return await this.productRepository.save(productEntity);
  }
}
