import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@libs/http';
import { ErrorCode } from '@libs/shared';

export class PayrollMemberNotFoundException extends DomainException {
  constructor() {
    super(ErrorCode.MemberNotFound, HttpStatus.NOT_FOUND, '멤버 정보를 찾을 수 없습니다.', 'Payroll member not found');
  }
}
