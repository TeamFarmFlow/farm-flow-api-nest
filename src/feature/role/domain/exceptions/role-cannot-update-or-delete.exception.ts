import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@app/core/exceptions';

export class RoleCannotUpdateOrDeleteException extends DomainException {
  constructor() {
    super('ROLE_CANNOT_UPDATE_OR_DELETE', HttpStatus.FORBIDDEN, 'Role cannot update or delete');
  }
}
