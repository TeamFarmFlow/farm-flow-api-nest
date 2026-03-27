import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@libs/http';
import { ErrorCode } from '@libs/shared';

export class InvitationFarmNotFoundException extends DomainException {
  constructor() {
    super(ErrorCode.FarmNotFound, HttpStatus.NOT_FOUND, '농장 정보를 찾을 수 없습니다.', 'farm not found');
  }
}
