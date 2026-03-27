import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@libs/http';
import { ErrorCode } from '@libs/shared';

export class MemberNotFoundException extends DomainException {
  constructor() {
    super(ErrorCode.MemberNotFound, HttpStatus.NOT_FOUND, '농장의 멤버를 찾을 수 없습니다.', 'Member not found');
  }
}
