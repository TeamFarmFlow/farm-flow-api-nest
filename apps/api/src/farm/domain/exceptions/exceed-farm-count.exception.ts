import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@libs/http';
import { ErrorCode } from '@libs/shared';

export class ExceedFarmCountException extends DomainException {
  constructor() {
    super(ErrorCode.ExceedFarmCount, HttpStatus.CONFLICT, '농장 생성 최대 수를 초과하였습니다.', 'Exceed farm count');
  }
}
