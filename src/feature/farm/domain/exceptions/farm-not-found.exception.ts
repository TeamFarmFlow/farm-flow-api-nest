import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@app/core/exceptions';

export class FarmNotFoundException extends DomainException {
  constructor() {
    super('FARM_NOT_FOUND', HttpStatus.NOT_FOUND, 'Farm not found');
  }
}
