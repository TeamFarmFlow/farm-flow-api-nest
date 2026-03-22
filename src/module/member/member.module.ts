import { Module } from '@nestjs/common';

import { FarmUserEntity, FarmUserRepository, RoleEntity, RoleRepository, TypeOrmExModule } from '@app/infra/persistence/typeorm';

import { MemberService } from './application';
import { MemberController } from './presentation';

@Module({
  imports: [TypeOrmExModule.forFeature([RoleEntity, FarmUserEntity], [FarmUserRepository, RoleRepository])],
  controllers: [MemberController],
  providers: [MemberService],
})
export class MemberModule {}
