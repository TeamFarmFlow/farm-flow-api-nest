import { Module } from '@nestjs/common';

import {
  GetMembersQueryHandler,
  MEMBER_FARM_USER_REPOSITORY,
  MEMBER_ROLE_REPOSITORY,
  RemoveMemberCommandHandler,
  UpdateMemberPayrollCommandHandler,
  UpdateMemberRoleCommandHandler,
} from './application';
import { TypeOrmMemberFarmUserRepository, TypeOrmMemberRoleRepository } from './infra';
import { MemberController } from './presentation';

const repositories = [TypeOrmMemberRoleRepository, TypeOrmMemberFarmUserRepository];
const queryHandlers = [GetMembersQueryHandler];
const commandHandlers = [UpdateMemberRoleCommandHandler, UpdateMemberPayrollCommandHandler, RemoveMemberCommandHandler];

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
    ...repositories,
    ...queryHandlers,
    ...commandHandlers,
  ],
})
export class MemberModule {}
