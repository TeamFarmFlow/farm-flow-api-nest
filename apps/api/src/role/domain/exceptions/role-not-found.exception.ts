import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@libs/http';
import { ErrorCode } from '@libs/shared';

export class RoleNotFoundException extends DomainException {
  constructor() {
    super(ErrorCode.RoleNotFound, HttpStatus.NOT_FOUND, '역할 정보를 찾을 수 없습니다.', 'Role not found');
  }
}
