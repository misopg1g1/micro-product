import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { ProductService } from './product.service';
import { ProductEntity } from './product.entity';
import { CategoryEntity } from '../category/category.entity';
import { plainToInstance } from 'class-transformer';
import { CategoryService } from '../category/category.service';
import { S3Service } from '../shared/aws/storage.service';
import {ConfigService} from "@nestjs/config";

describe('ProductService', () => {
  let service: ProductService;
  let productRepository: Repository<ProductEntity>;
  let categoryRepository: Repository<CategoryEntity>;
  let productList: ProductEntity[];
  let categoryList: CategoryEntity[];

  const seedDatabase = async () => {
    categoryList = [];
    productList = [];
    for (let i = 0; i < 3; i++) {
      const category = await categoryRepository.save({
        name: faker.name.firstName(),
        description: faker.lorem.lines(),
        status: faker.datatype.boolean(),
      });
      categoryList.push(category);
    }

    for (let i = 0; i < 5; i++) {
      const entity = plainToInstance(ProductEntity, {
        name: faker.datatype.string(),
        dimensions: [],
        type: 1,
        temperature_control: faker.datatype.number(),
        expiration_date: faker.datatype.datetime(),
        fragility_conditions: faker.datatype.string(),
        description: faker.datatype.string(),
        status: faker.datatype.boolean(),
        price: faker.datatype.number(),
        img_url: faker.image.imageUrl(),
        suppliers: faker.datatype.string(),
        category: [],
      });
      const product: ProductEntity = await productRepository.save(entity);
      productList.push(product);
    }
    for (const pr of productList) {
      pr.categories = categoryList;
      await productRepository.save(pr);
    }
    for (let i = 0; i < categoryList.length; i++) {
      categoryList[i] = await categoryRepository.findOne({
        where: {
          id: categoryList[i].id,
        },
        relations: ['products'],
      });
    }

    for (let i = 0; i < productList.length; i++) {
      productList[i] = await productRepository.findOne({
        where: {
          id: productList[i].id,
        },
        relations: ['categories'],
      });
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductService, CategoryService, S3Service, ConfigService],
      imports: [...TypeOrmTestingConfig()],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productRepository = module.get<Repository<ProductEntity>>(
      getRepositoryToken(ProductEntity),
    );
    categoryRepository = module.get<Repository<CategoryEntity>>(
      getRepositoryToken(CategoryEntity),
    );
    await seedDatabase();
    console.log();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all cultures', async () => {
    const products: ProductEntity[] = await service.findAll(0, false);
    expect(products).not.toBeNull();
    expect(products).toHaveLength(productList.length);
  });

  it('findOne should return a culture by id', async () => {
    const storedProduct: ProductEntity = productList[0];
    const product: ProductEntity = await service.findOne(
      storedProduct.id,
      false,
    );
    expect(product).not.toBeNull();
    expect(product.name).toEqual(storedProduct.name);
    expect(product.description).toEqual(storedProduct.description);
  });

  it('findOne should throw an exception for an invalid culture', async () => {
    await expect(() =>
      service.findOne(faker.datatype.uuid(), false),
    ).rejects.toHaveProperty(
      'message',
      'El producto con el id dado no fue encontrado',
    );
  });
});
