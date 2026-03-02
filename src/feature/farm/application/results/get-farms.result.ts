import { Farm } from '@app/infra/persistence/typeorm';

export type GetFarmsResult = {
  total: number;
  rows: Farm[];
};
