import { RoleEntity, UserEntity } from '@app/infra/persistence/typeorm';

export type GetRoleDetailsResult = {
  role: RoleEntity;
  users: UserEntity[];
};
