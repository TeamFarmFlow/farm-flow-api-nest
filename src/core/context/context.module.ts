import { DynamicModule, Module } from '@nestjs/common';

import { Request, Response } from 'express';
import { ClsModule, ClsService } from 'nestjs-cls';
import { UAParser } from 'ua-parser-js';
import { v4 } from 'uuid';

import { ContextService } from './context.service';
import { ContextKey } from './enums';

@Module({})
export class ContextModule {
  public static forRoot(): DynamicModule {
    return {
      global: true,
      module: ContextModule,
      imports: [
        ClsModule.forRoot({
          middleware: {
            mount: true,
            setup(cls: ClsService, req: Request, res: Response) {
              const requestIdKey = 'x-request-id';
              const requestId = req.headers[requestIdKey] ?? v4();

              req.headers[requestIdKey] = requestId;
              res.set(requestIdKey, requestId);

              const ip = req.headers['x-forwarded-for']?.toString().split(',')[0] ?? req.headers['x-real-ip'] ?? req.ip;
              const userAgent = UAParser(req.headers['user-agent']);

              cls.set(requestIdKey, requestId);
              cls.set(ContextKey.RequestMethod, req.method);
              cls.set(ContextKey.RequestURL, req.url);
              cls.set(ContextKey.RequestIpAddress, ip === '::1' ? '127.0.0.1' : ip);
              cls.set(ContextKey.RequestOS, `${userAgent.os.name}(${userAgent.os.version})`);
              cls.set(ContextKey.RequestDevice, !userAgent.device.vendor && !userAgent.device.model ? 'Desktop' : `${userAgent.device.vendor}(${userAgent.device.model})`);
              cls.set(ContextKey.RequestBrowser, `${userAgent.browser.name}(${userAgent.browser.version})`);
            },
          },
        }),
      ],
      providers: [ContextService],
      exports: [ContextService],
    };
  }
}
