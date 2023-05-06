import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { ProductService } from './product.service';
import { ProductEntity } from './product.entity';
import { CategoryEntity } from '../category/category.entity';
import { plainToInstance } from 'class-transformer';
import { CategoryService } from '../category/category.service';
import { S3Service } from '../shared/aws/storage.service';
import { ConfigService } from '@nestjs/config';
import { CreateProductDto } from './product.dto';
import { readFileSync } from 'fs';
import { S3 } from 'aws-sdk';

const getBase64 = (file): any => {
  return readFileSync(file, { encoding: 'base64' });
};
const createMockProduct = () => ({
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
  categories: [],
});
describe('ProductService', () => {
  const entities = [ProductEntity, CategoryEntity];
  let service: ProductService;
  let productRepository: Repository<ProductEntity>;
  let categoryRepository: Repository<CategoryEntity>;
  let awsService: S3Service;
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
      const entity = plainToInstance(ProductEntity, createMockProduct());
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
    const options = () => {
      return {
        ...TypeOrmTestingConfig(),
        entities: entities,
      };
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductService, CategoryService, S3Service, ConfigService],
      imports: [
        TypeOrmModule.forRoot(options()),
        TypeOrmModule.forFeature(entities),
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    awsService = module.get<S3Service>(S3Service);
    productRepository = module.get<Repository<ProductEntity>>(
      getRepositoryToken(ProductEntity),
    );
    categoryRepository = module.get<Repository<CategoryEntity>>(
      getRepositoryToken(CategoryEntity),
    );
    await seedDatabase();
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

  it('Creating a product should succeed and return a new product', async () => {
    const newProductDto = plainToInstance(
      CreateProductDto,
      createMockProduct(),
    );
    newProductDto.categories = [categoryList[0].name];
    const createdProduct = await service.create(newProductDto);
    const products: ProductEntity[] = await service.findAll(0, false);
    expect(products.length).toEqual(6);
    expect(createdProduct.name).toEqual(newProductDto.name);
    expect(createdProduct.img_url).toEqual(
      'https://kiranametro.com/admin/public/size_primary_images/no-image.jpg',
    );
  });

  it('Should create a new product with new image', async () => {
    const s3Mock = {
      upload: jest.fn().mockImplementation(() => {
        return {
          promise: jest.fn().mockResolvedValue({
            ETag: 'mocked ETag',
            Location: 'mocked Location',
          }),
        };
      }),
    };
    jest.spyOn(S3.prototype, 'upload').mockReturnValueOnce(s3Mock.upload());
    const newProductDto = plainToInstance(
      CreateProductDto,
      createMockProduct(),
    );
    newProductDto.categories = [categoryList[0].name];
    newProductDto.img_base64_data = getBase64('static/images.png');
    const createdProduct = await service.create(newProductDto);
    const products: ProductEntity[] = await service.findAll(0, false);
    expect(products.length).toEqual(6);
    expect(createdProduct.name).toEqual(newProductDto.name);
    expect(createdProduct.img_url).toEqual('mocked Location');
  });

  it('Should delete an image if product creation process fails', async () => {
    const s3Mock = {
      upload: jest.fn().mockImplementation(() => {
        return {
          promise: jest.fn().mockResolvedValue({
            Key: 'some key',
            ETag: 'mocked ETag',
            Location: 'mocked Location',
          }),
        };
      }),

      deleteImage: jest.fn().mockResolvedValue('something'),
    };
    jest.spyOn(S3.prototype, 'upload').mockReturnValueOnce(s3Mock.upload());
    console.log(S3.prototype.deleteObject);
    jest
      .spyOn(S3Service.prototype, 'deleteImage')
      .mockReturnValueOnce(s3Mock.deleteImage());
    const mockedProduct = createMockProduct();
    const newProductDto = plainToInstance(CreateProductDto, mockedProduct);
    newProductDto.categories = [categoryList[0].name];
    newProductDto.img_base64_data = getBase64('static/images.png');
    await service.create(newProductDto);
    try {
      await service.create(newProductDto);
    } catch {
      console.log();
    }
    const products: ProductEntity[] = await service.findAll(0, false);
    expect(products.length).toEqual(6);
    expect(s3Mock.deleteImage).toBeCalled();
  });
});
