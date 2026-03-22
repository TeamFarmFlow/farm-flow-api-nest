import { Member } from '../../domain';

export type GetMembersResult = {
  total: number;
  rows: Member[];
};
