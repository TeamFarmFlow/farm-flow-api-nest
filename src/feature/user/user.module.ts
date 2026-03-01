import { Module } from '@nestjs/common';

import { UserRepositoryProvider } from '@app/infra/persistence/typeorm';

@Module({
  providers: [UserRepositoryProvider],
  exports: [UserRepositoryProvider],
})
export class UserModule {}
