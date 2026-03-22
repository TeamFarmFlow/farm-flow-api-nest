import { FarmUser } from '../../domain';

export type GetFarmsResult = {
  total: number;
  rows: FarmUser[];
};
