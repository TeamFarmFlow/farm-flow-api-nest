import { FarmEntity, RoleEntity } from '@app/infra/persistence/typeorm';

export type GetFarmsResult = {
  total: number;
  rows: { farm: FarmEntity; role: RoleEntity | null }[];
};
