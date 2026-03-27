import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@libs/http';
import { ErrorCode } from '@libs/shared';

export class MemberProtectedException extends DomainException {
  constructor() {
    super(ErrorCode.MemberProtected, HttpStatus.FORBIDDEN, '멤버의 정보를 수정하거나 삭제할 수 없습니다.', 'Member protected');
  }
}
