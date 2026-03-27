import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@libs/http';
import { ErrorCode } from '@libs/shared';

export class ForbiddenFarmUserException extends DomainException {
  constructor() {
    super(ErrorCode.ForbiddenPermission, HttpStatus.FORBIDDEN, '농장의 멤버를 찾을 수 없습니다.', 'Forbidden farm user');
  }
}
