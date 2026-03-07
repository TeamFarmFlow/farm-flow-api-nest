import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@app/core/exceptions';
import { ErrorCode } from '@app/shared/domain';

export class InvalidQrCodeException extends DomainException {
  constructor() {
    super(ErrorCode.InvalidQrCode, HttpStatus.BAD_REQUEST, 'Invalid qr code');
  }
}
