import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@app/core/exceptions';
import { ErrorCode } from '@app/shared/domain';

export class PayrollMemberNotFoundException extends DomainException {
  constructor() {
    super(ErrorCode.MemberNotFound, HttpStatus.NOT_FOUND, 'Payroll member not found');
  }
}
