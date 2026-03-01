import { ExecutionContext, Injectable } from '@nestjs/common';

import { ClsService } from 'nestjs-cls';

import { ContextKey } from './enums';

@Injectable()
export class ContextService<IUser = unknown> {
  constructor(private readonly clsService: ClsService) {}

  get<K = string, V = unknown>(key: K) {
    return this.clsService.get<V>(key) as V;
  }

  set<K = string, V = unknown>(key: K, value: V) {
    return this.clsService.set(key as string, value);
  }

  get user() {
    return this.clsService.get('user') as IUser;
  }

  set user(user: IUser) {
    this.clsService.set<string>('user', user);
  }

  get context() {
    return this.clsService.get<ExecutionContext>('context');
  }

  set context(context: ExecutionContext) {
    this.clsService.set('context', context);
  }

  get contextName() {
    const context = this.clsService.get<ExecutionContext>('context');
    const className = context?.getClass()?.name;
    const handlerName = context?.getHandler()?.name;

    if (!className && !handlerName) {
      return null;
    }

    return [className, handlerName].join('.');
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
      user: this.user,
    };
  }
}
