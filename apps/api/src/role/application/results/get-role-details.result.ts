import { Role, RoleUser } from '../../domain';

export type GetRoleDetailsResult = {
  role: Role;
  users: RoleUser[];
};
