import { Farm, Role } from '@app/infra/persistence/typeorm';

export type GetFarmsResult = {
  total: number;
  rows: { farm: Farm; role: Role | null }[];
};
