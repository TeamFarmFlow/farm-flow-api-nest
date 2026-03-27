import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@libs/http';
import { ErrorCode } from '@libs/shared';

export class InvalidInvitationCodeException extends DomainException {
  constructor() {
    super(ErrorCode.InvalidInvitationCode, HttpStatus.BAD_REQUEST, '초대 코드가 유효하지 않습니다.', 'Invalid invitation code');
  }
}
