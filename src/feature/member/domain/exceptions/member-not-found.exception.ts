import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@app/core/exceptions';
import { ErrorCode } from '@app/shared/domain';

export class MemberNotFoundException extends DomainException {
  constructor() {
    super(ErrorCode.MemberNotFound, HttpStatus.NOT_FOUND, 'Member not found');
  }
}
