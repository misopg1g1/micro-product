import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ProductEntity } from '../product/product.entity';
import { CategoryEntity } from './category.entity';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { CategoryDto, PatchCategoryDto } from './category.dto';

describe('CategoryService', () => {
  const entities = [ProductEntity, CategoryEntity];
  let service: CategoryService;
  let categoryList: CategoryEntity[];
  let categoryRepository: Repository<CategoryEntity>;
  const createMockCategory = () => ({
    name: faker.name.firstName(),
    description: faker.lorem.lines(),
    status: faker.datatype.boolean(),
  });
  const seedDatabase = async () => {
    categoryList = [];
    for (let i = 0; i < 3; i++) {
      const category = await categoryRepository.save(createMockCategory());
      categoryList.push(category);
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
      providers: [CategoryService],
      imports: [
        TypeOrmModule.forRoot(options()),
        TypeOrmModule.forFeature(entities),
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    categoryRepository = module.get<Repository<CategoryEntity>>(
      getRepositoryToken(CategoryEntity),
    );
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should return all categories', async () => {
    const categories = await service.findAll(false);
    expect(categories.length).toEqual(3);
  });

  it('Should return one specific category', async () => {
    const category: CategoryEntity = categoryList[0];

    const searchedCategory: CategoryEntity = await service.findOne({
      where: { id: category.id },
      relations: false,
    });
    expect(searchedCategory.name).toEqual(category.name);
  });

  it('Should create a category', async () => {
    const mockCategory = createMockCategory();
    const mockCategoryEntity = plainToInstance(CategoryEntity, mockCategory);
    const createdCategory = await service.createCategory(mockCategoryEntity);
    expect(createdCategory.name).toEqual(mockCategory.name);
    const categories = await service.findAll(false);
    expect(categories.length).toEqual(4);
  });

  it('Should edit an exiting category', async () => {
    const relevantCategory = categoryList[0];
    const patchCategoryDto = plainToInstance(PatchCategoryDto, {
      name: 'new name',
    });
    await service.editCategory(relevantCategory.id, patchCategoryDto);
    const searchedCategory: CategoryEntity = await service.findOne({
      where: { id: relevantCategory.id },
      relations: false,
    });
    expect(searchedCategory.name).toEqual('new name');
  });
});
