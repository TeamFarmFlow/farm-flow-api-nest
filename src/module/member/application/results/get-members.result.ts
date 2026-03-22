import { Role, User } from '@app/infra/persistence/typeorm';

export type GetMembersResult = {
  total: number;
  rows: { user: User; role: Role | null }[];
};
