import { ExecutionContext } from '@nestjs/common';

import { ContextUser } from '../domain';

export interface ContextServicePort {
  get user(): ContextUser;
  set user(contextUser: ContextUser);
  get contextName(): string | null;
  set context(context: ExecutionContext);
}
