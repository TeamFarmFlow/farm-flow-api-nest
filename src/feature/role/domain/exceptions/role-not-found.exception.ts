import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@app/core/exceptions';

export class RoleNotFoundException extends DomainException {
  constructor() {
    super('ROLE_NOT_FOUND', HttpStatus.NOT_FOUND, 'Role not found');
  }
}
