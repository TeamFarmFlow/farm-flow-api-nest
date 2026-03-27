import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@libs/http';
import { ErrorCode } from '@libs/shared';

export class WrongEmailOrPasswordException extends DomainException {
  constructor() {
    super(ErrorCode.WrongEmailOrPassword, HttpStatus.UNAUTHORIZED, '이메일 계정이 없거나 비밀번호가 일치하지 않습니다.', 'Wrong email or password');
  }
}
