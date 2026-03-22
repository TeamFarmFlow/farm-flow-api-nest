import { MemberRole } from './member-role';
import { MemberUser } from './member-user';

export class Member {
  user: MemberUser;
  role: MemberRole | null;
  payRatePerHour: number;
  payDeductionAmount: number;
}
