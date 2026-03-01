import { Injectable } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { CookieOptions } from 'express';
import { utilities, WinstonModuleOptions } from 'nest-winston';
import { ExtractJwt, WithSecretOrKey } from 'passport-jwt';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import winston from 'winston';

import { NodeEnv } from './enums';

@Injectable()
export class Configuration extends ConfigService {
  get appName() {
    return this.getOrThrow<string>('npm_package_name');
  }

  get appVersion() {
    return this.getOrThrow<string>('npm_package_version');
  }

  get nodeEnv(): NodeEnv {
    return this.getOrThrow<NodeEnv>('NODE_ENV');
  }

  get listenPort(): number {
    return +this.getOrThrow<string>('PORT');
  }

  get corsOptions(): CorsOptions {
    return {
      origin: new RegExp(this.getOrThrow<string>('CORS_ORIGIN')),
      credentials: true,
    };
  }

  get winstonModuleOptions(): WinstonModuleOptions {
    const isLocal = this.nodeEnv === NodeEnv.Local;

    return {
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            isLocal
              ? utilities.format.nestLike(`${this.appName}:${this.appVersion}:${this.nodeEnv}`, {
                  appName: true,
                  processId: true,
                  prettyPrint: true,
                  colors: true,
                })
              : winston.format.json(),
          ),
        }),
      ],
      level: isLocal ? 'silly' : 'verbose',
    };
  }

  get typeormModuleOptions(): TypeOrmModuleOptions {
    const isLocal = this.nodeEnv === NodeEnv.Local;

    return {
      type: 'postgres',
      host: this.getOrThrow<string>('DB_HOST'),
      port: +this.getOrThrow<string>('DB_PORT'),
      username: this.getOrThrow<string>('DB_USERNAME'),
      password: this.getOrThrow<string>('DB_PASSWORD'),
      database: this.getOrThrow<string>('DB_DATABASE'),
      synchronize: isLocal,
      namingStrategy: new SnakeNamingStrategy(),
      logging: isLocal ? true : ['error', 'warn'],
      entities: [process.cwd() + '/dist/**/*.entity.{js,ts}'],
    };
  }

  get jwtModuleOptions(): JwtModuleOptions {
    return {
      secret: this.getOrThrow<string>('JWT_SECRET'),
    };
  }

  get passportJwtStrategyOptions(): WithSecretOrKey {
    return {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: this.getOrThrow<string>('JWT_SECRET'),
    };
  }

  get cookieOptions(): CookieOptions {
    const isLocal = this.nodeEnv === NodeEnv.Local;

    return {
      httpOnly: true,
      secure: isLocal ? false : true,
      sameSite: isLocal ? 'lax' : 'none',
      path: 'api/v1/auth',
    };
  }
}
