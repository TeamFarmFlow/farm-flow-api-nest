import { ExecutionContext, Injectable } from '@nestjs/common';

import { ClsService } from 'nestjs-cls';

import { ContextUser } from './domain';
import { ContextKey } from './enums';
import { ContextServicePort } from './ports';

@Injectable()
export class ContextService implements ContextServicePort {
  constructor(private readonly clsService: ClsService) {}

  private get<V = unknown, K = string>(key: K) {
    return this.clsService.get<V>(key) as V;
  }

  private set<V = unknown, K = string>(key: K, value: V) {
    return this.clsService.set(key as string, value);
  }

  get user(): ContextUser {
    return this.get<ContextUser>('user') ?? null;
  }

  set user(contextUser: ContextUser) {
    this.set('user', contextUser);
  }

  get contextName(): string | null {
    const context = this.get<ExecutionContext>('context');
    const className = context?.getClass()?.name;
    const handlerName = context?.getHandler()?.name;

    if (!className && !handlerName) {
      return null;
    }

    return [className, handlerName].join('.');
  }

  set context(context: ExecutionContext) {
    this.set('context', context);
  }

  get log() {
    return {
      requestId: this.get(ContextKey.RequestID),
      method: this.get(ContextKey.RequestMethod),
      url: this.get(ContextKey.RequestURL),
      ip: this.get(ContextKey.RequestIpAddress),
      os: this.get(ContextKey.RequestOS),
      device: this.get(ContextKey.RequestDevice),
      browser: this.get(ContextKey.RequestBrowser),
      user: {
        userId: this.get('user.id'),
        farmId: this.get('farm.id'),
      },
    };
  }
}
