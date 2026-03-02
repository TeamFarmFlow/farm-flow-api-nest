import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@app/core/exceptions';

export class ExceedFarmCountException extends DomainException {
  constructor() {
    super('EXCEED_FARM_COUNT', HttpStatus.CONFLICT, 'Exceed farm count');
  }
}
