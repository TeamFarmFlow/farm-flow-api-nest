import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

import { Repository } from 'typeorm';

import { TYPEORM_EX_REPOSITORY_ENTITY } from './typeorm.repository';

@Module({})
export class TypeOrmExModule {
  static forFeature(entities: EntityClassOrSchema[], repositories: Type<unknown>[]): DynamicModule {
    const providers: Provider[] = repositories.map((TypeOrmRepository) => {
      const entity = Reflect.getMetadata(TYPEORM_EX_REPOSITORY_ENTITY, TypeOrmRepository) as EntityClassOrSchema;

      if (!entity) {
        throw new Error(`${TypeOrmRepository.name}: missing @TypeOrmExRepository(Entity)`);
      }

      return {
        provide: TypeOrmRepository,
        inject: [getRepositoryToken(entity)],
        useFactory: (repository: Repository<any>) => new TypeOrmRepository(repository),
      };
    });

    return {
      module: TypeOrmExModule,
      imports: [TypeOrmModule.forFeature(entities)],
      providers,
      exports: providers,
    };
  }
}
