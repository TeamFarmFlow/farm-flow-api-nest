import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { compareSync, hashSync } from 'bcrypt';
import { isUUID } from 'class-validator';
import { Request, Response } from 'express';

import { CookieService } from '@app/core';
import { RefreshToken, RefreshTokenRepository, User, UserRepository } from '@app/infra/persistence/typeorm';
import { JwtClaims } from '@app/shared/security';

import { DuplicatedEmailEXception, InvalidTokenException, WrongEmailOrPasswordException } from '../domain';

import { LoginCommand, RegisterCommand } from './command';
import { AuthResult } from './result';

@Injectable()
export class AuthService {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly userRepository: UserRepository,
    private readonly cookieService: CookieService,
    private readonly jwtService: JwtService,
  ) {}

  private async issueAccessToken(user: User) {
    const payload = JwtClaims.fromPrincipal(user).toObject();
    const expiresIn = 10 * 60;
    const expiresAt = new Date(Date.now() + expiresIn * 1000);
    const accessToken = await this.jwtService.signAsync(payload, { expiresIn });

    return { accessToken, expiresIn, expiresAt };
  }

  private async issueRefreshToken(user: User): Promise<string> {
    const refreshTokenEntity = RefreshToken.of(user.id);
    await this.refreshTokenRepository.insert(refreshTokenEntity);

    return refreshTokenEntity.id;
  }

  async register(command: RegisterCommand, res: Response): Promise<AuthResult> {
    if (await this.userRepository.hasOneByEmail(command.email)) {
      throw new DuplicatedEmailEXception();
    }

    const user = await this.userRepository.save(User.ownerOf({ ...command, password: hashSync(command.password, 10) }));

    const { accessToken, expiresIn, expiresAt } = await this.issueAccessToken(user);
    const refreshToken = await this.issueRefreshToken(user);

    this.cookieService.setRefreshToken(res, refreshToken);

    return { accessToken, expiresIn, expiresAt, user };
  }

  async login(command: LoginCommand, res: Response): Promise<AuthResult> {
    const user = await this.userRepository.findOneByEmail(command.email);

    if (!user) {
      throw new WrongEmailOrPasswordException();
    }

    if (!compareSync(command.password, user.password)) {
      throw new WrongEmailOrPasswordException();
    }

    const { accessToken, expiresIn, expiresAt } = await this.issueAccessToken(user);
    const refreshToken = await this.issueRefreshToken(user);

    this.cookieService.setRefreshToken(res, refreshToken);

    return { accessToken, expiresIn, expiresAt, user };
  }

  async refresh(req: Request, res: Response): Promise<AuthResult> {
    const refreshTokenValue = this.cookieService.parseRefreshToken(req);

    if (!isUUID(refreshTokenValue, 4)) {
      this.cookieService.clearRefreshToken(res);
      throw new InvalidTokenException();
    }

    const refreshToken = await this.refreshTokenRepository.findValidByIdWithUser(refreshTokenValue);

    if (!refreshToken) {
      this.cookieService.clearRefreshToken(res);
      throw new InvalidTokenException();
    }

    await this.refreshTokenRepository.deleteById(refreshTokenValue);

    const { accessToken, expiresIn, expiresAt } = await this.issueAccessToken(refreshToken.user);
    const newRefreshToken = await this.issueRefreshToken(refreshToken.user);

    this.cookieService.setRefreshToken(res, newRefreshToken);

    return { accessToken, expiresIn, expiresAt, user: refreshToken.user };
  }
}
