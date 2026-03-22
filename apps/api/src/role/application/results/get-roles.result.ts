import { Role } from '../../domain';

export type GetRolesResult = {
  total: number;
  rows: Role[];
};
