import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@libs/http';
import { ErrorCode } from '@libs/shared';

export class PayrollMemberNotFoundException extends DomainException {
  constructor() {
    super(ErrorCode.MemberNotFound, HttpStatus.NOT_FOUND, 'Payroll member not found');
  }
}
