import { Role, User } from '@app/infra/persistence/typeorm';

export type GetRoleDetailsResult = {
  role: Role;
  users: User[];
};
