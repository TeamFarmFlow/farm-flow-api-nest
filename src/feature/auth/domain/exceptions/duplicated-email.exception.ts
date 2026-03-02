import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@app/core/exceptions';

export class DuplicatedEmailEXception extends DomainException {
  constructor() {
    super('DUPLICATED_EMAIL', HttpStatus.CONFLICT, 'Duplicated email');
  }
}
