import { Module } from '@nestjs/common';

import { GetMembersQueryHandler, MEMBER_FARM_USER_REPOSITORY, MEMBER_ROLE_REPOSITORY, RemoveMemberCommandHandler, UpdateMemberCommandHandler } from './application';
import { TypeOrmMemberFarmUserRepository, TypeOrmMemberRoleRepository } from './infra';
import { MemberController } from './presentation';

@Module({
  controllers: [MemberController],
  providers: [
    {
      provide: MEMBER_ROLE_REPOSITORY,
      useExisting: TypeOrmMemberRoleRepository,
    },
    {
      provide: MEMBER_FARM_USER_REPOSITORY,
      useExisting: TypeOrmMemberFarmUserRepository,
    },
    GetMembersQueryHandler,
    UpdateMemberCommandHandler,
    RemoveMemberCommandHandler,
    TypeOrmMemberRoleRepository,
    TypeOrmMemberFarmUserRepository,
  ],
})
export class MemberModule {}
