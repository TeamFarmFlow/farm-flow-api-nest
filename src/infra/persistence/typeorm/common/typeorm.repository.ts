import { ObjectLiteral } from 'typeorm';

import 'reflect-metadata';

export const TYPEORM_EX_REPOSITORY_ENTITY = Symbol('TYPEORM_EX_REPOSITORY_ENTITY');

export const TypeOrmExRepository = (entity: ObjectLiteral): ClassDecorator => {
  return (target) => {
    Reflect.defineMetadata(TYPEORM_EX_REPOSITORY_ENTITY, entity, target);
  };
};
