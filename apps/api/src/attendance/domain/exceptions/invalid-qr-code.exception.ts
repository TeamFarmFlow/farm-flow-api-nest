import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@libs/http';
import { ErrorCode } from '@libs/shared';

export class InvalidQrCodeException extends DomainException {
  constructor() {
    super(ErrorCode.InvalidQrCode, HttpStatus.BAD_REQUEST, 'QR 코드가 유효하지 않습니다. 다시 시도해주세요.', 'Invalid qr code');
  }
}
