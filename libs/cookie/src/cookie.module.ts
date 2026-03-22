import { Module } from '@nestjs/common';

import { CookieService } from './cookie.service';
import { COOKIE_SERVICE } from './ports';

@Module({
  providers: [
    CookieService,
    {
      provide: COOKIE_SERVICE,
      useExisting: CookieService,
    },
  ],
  exports: [COOKIE_SERVICE],
})
export class CookieModule {}
