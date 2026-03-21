import { Farm, Role } from '@app/infra/persistence/typeorm';

export type GetFarmResult = {
  farm: Farm;
  role: Role | null;
};
