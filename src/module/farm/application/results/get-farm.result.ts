import { FarmEntity, RoleEntity } from '@app/infra/persistence/typeorm';

export type GetFarmResult = {
  farm: FarmEntity;
  role: RoleEntity | null;
};
