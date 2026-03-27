import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@libs/http';
import { ErrorCode } from '@libs/shared';

export class ForbiddenPermissionException extends DomainException {
  constructor() {
    super(ErrorCode.ForbiddenPermission, HttpStatus.FORBIDDEN, '접근 권한이 없습니다.', 'Forbidden permission');
  }
}
