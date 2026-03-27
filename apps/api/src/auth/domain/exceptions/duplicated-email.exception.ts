import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@libs/http';
import { ErrorCode } from '@libs/shared';

export class DuplicatedEmailEXception extends DomainException {
  constructor() {
    super(ErrorCode.DuplicatedEmail, HttpStatus.CONFLICT, '이미 가입된 이메일 계정입니다.', 'Duplicated email');
  }
}
