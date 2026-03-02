import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@app/core/exceptions';

export class WrongEmailOrPasswordException extends DomainException {
  constructor() {
    super('WRONG_EMAIL_OR_PASSWORD', HttpStatus.UNAUTHORIZED, 'Wrong email or password');
  }
}
