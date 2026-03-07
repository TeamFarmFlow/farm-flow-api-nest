import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@app/core/exceptions';
import { ErrorCode } from '@app/shared/domain';

export class RoleCannotUpdateOrDeleteException extends DomainException {
  constructor() {
    super(ErrorCode.RoleCannotUpdateOrDelete, HttpStatus.FORBIDDEN, 'Role cannot update or delete');
  }
}
