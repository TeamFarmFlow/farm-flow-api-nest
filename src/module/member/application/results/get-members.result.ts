import { RoleEntity, UserEntity } from '@app/infra/persistence/typeorm';

export type GetMembersResult = {
  total: number;
  rows: { user: UserEntity; role: RoleEntity | null }[];
};
