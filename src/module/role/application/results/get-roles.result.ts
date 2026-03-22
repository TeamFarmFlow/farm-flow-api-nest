import { RoleEntity } from '@app/infra/persistence/typeorm';

export type GetRolesResult = {
  total: number;
  rows: RoleEntity[];
};
