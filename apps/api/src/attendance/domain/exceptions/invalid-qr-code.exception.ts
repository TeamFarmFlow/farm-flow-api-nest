import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@libs/http';
import { ErrorCode } from '@libs/shared';

export class InvalidQrCodeException extends DomainException {
  constructor() {
    super(ErrorCode.InvalidQrCode, HttpStatus.BAD_REQUEST, 'Invalid qr code');
  }
}
