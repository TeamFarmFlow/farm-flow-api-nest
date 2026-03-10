import { Module } from '@nestjs/common';

import { FarmUser, FarmUserRepository, Role, RoleRepository, TypeOrmExModule } from '@app/infra/persistence/typeorm';

import { MemberService } from './application';
import { MemberController } from './presentation';

@Module({
  imports: [TypeOrmExModule.forFeature([Role, FarmUser], [FarmUserRepository, RoleRepository])],
  controllers: [MemberController],
  providers: [MemberService],
})
export class MemberModule {}
