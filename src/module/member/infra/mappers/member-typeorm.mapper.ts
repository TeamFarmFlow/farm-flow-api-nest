import { FarmUserEntity, RoleEntity, UserEntity } from '@app/infra/persistence/typeorm';

import { Member, MemberRole, MemberUser } from '../../domain';

export class MemberTypeOrmMapper {
  static toMember(farmUser: FarmUserEntity): Member {
    const member = new Member();

    member.user = MemberTypeOrmMapper.toMemberUser(farmUser.user);
    member.role = farmUser.role ? MemberTypeOrmMapper.toMemberRole(farmUser.role) : null;
    member.payRatePerHour = farmUser.payRatePerHour;
    member.payDeductionAmount = farmUser.payDeductionAmount;

    return member;
  }

  static toMemberUser(user: UserEntity): MemberUser {
    const memberUser = new MemberUser();

    memberUser.id = user.id;
    memberUser.email = user.email;
    memberUser.name = user.name;

    return memberUser;
  }

  static toMemberRole(role: RoleEntity): MemberRole {
    const memberRole = new MemberRole();

    memberRole.id = role.id;
    memberRole.name = role.name;
    memberRole.super = role.super;
    memberRole.required = role.required;
    memberRole.farmId = role.farmId;

    return memberRole;
  }
}
