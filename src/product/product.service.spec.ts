import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { ProductService } from './product.service';
import { ProductEntity } from './product.entity';

describe('ProductService', () => {
  let service: ProductService;
  let repository: Repository<ProductEntity>;
  let productList: ProductEntity[];

  const seedDatabase = async () => {
    repository.clear();
    productList = [];
    for (let i = 0; i < 5; i++) {
      const product: ProductEntity = await repository.save({
        id: faker.datatype.uuid(),
        name: faker.datatype.string(),
        sku: faker.datatype.string(),
        array: [],
        type: [],
        temperature_control: faker.datatype.number(),
        expiration_date: faker.datatype.datetime(),
        fragility_conditions: faker.datatype.string(),
        description: faker.datatype.string(),
        status: faker.datatype.boolean(),
        price: faker.datatype.number(),
        img_url: faker.image.imageUrl(),
        suppliers: faker.datatype.string(),
        category: {},
      });
      productList.push(product);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductService],
      imports: [...TypeOrmTestingConfig()],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<Repository<ProductEntity>>(
      getRepositoryToken(ProductEntity),
    );
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all cultures', async () => {
    const cultures: ProductEntity[] = await service.findAll();
    expect(cultures).not.toBeNull();
    expect(cultures).toHaveLength(productList.length);
  });

  it('findOne should return a culture by id', async () => {
    const storedProduct: ProductEntity = productList[0];
    const product: ProductEntity = await service.findOne(storedProduct.id);
    expect(product).not.toBeNull();
    expect(product.name).toEqual(storedProduct.name);
    expect(product.description).toEqual(storedProduct.description);
  });

  it('findOne should throw an exception for an invalid culture', async () => {
    await expect(() =>
      service.findOne(faker.datatype.uuid()),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });
});
