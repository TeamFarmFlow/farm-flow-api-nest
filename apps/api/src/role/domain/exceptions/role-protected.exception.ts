import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@libs/http';
import { ErrorCode } from '@libs/shared';

export class RoleProtectedException extends DomainException {
  constructor() {
    super(ErrorCode.RoleProtected, HttpStatus.FORBIDDEN, '수정 또는 삭제가 불가능한 역할입니다.', 'Role protected');
  }
}
