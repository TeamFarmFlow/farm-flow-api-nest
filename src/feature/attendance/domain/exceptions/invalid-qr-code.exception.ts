import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@app/core/exceptions';

export class InvalidQrCodeException extends DomainException {
  constructor() {
    super('INVALID_QR_CODE', HttpStatus.BAD_REQUEST, 'Invalid qr code');
  }
}
