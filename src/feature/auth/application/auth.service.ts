import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { compare, hash } from 'bcrypt';
import { isUUID } from 'class-validator';
import { Request, Response } from 'express';
import { DataSource } from 'typeorm';

import { CookieService } from '@app/core/cookies';
import { FarmNotFoundException } from '@app/feature/farm/domain';
import { FarmUserRepository, RefreshToken, RefreshTokenRepository, RolePermissionRepository, UserRepository, UserUsage } from '@app/infra/persistence/typeorm';
import { JwtClaims } from '@app/shared/security';

import { DuplicatedEmailEXception, InvalidTokenException, WrongEmailOrPasswordException } from '../domain';

import { CheckInCommand, LoginCommand, RegisterCommand } from './command';
import { AuthResult, IssueAccessTokenResult } from './result';

@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
    private readonly cookieService: CookieService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly userRepository: UserRepository,
    private readonly farmUserRepository: FarmUserRepository,
    private readonly rolePermissionRepository: RolePermissionRepository,
  ) {}

  private async issueAccessToken(userId: string, farmId: string | null = null): Promise<IssueAccessTokenResult> {
    const payload = JwtClaims.from(userId, farmId).toObject();
    const expiresIn = 10 * 60;
    const expiresAt = new Date(Date.now() + expiresIn * 1000);
    const accessToken = await this.jwtService.signAsync(payload, { expiresIn });

    return { accessToken, expiresIn, expiresAt };
  }

  private async issueRefreshToken(userId: string, farmId: string | null = null, incomingRefreshTokenId?: string) {
    return this.dataSource.transaction(async (em) => {
      if (incomingRefreshTokenId) {
        await this.refreshTokenRepository.deleteById(incomingRefreshTokenId, em);
      }

      const refreshTokenEntity = RefreshToken.of(userId, farmId);
      await this.refreshTokenRepository.insert(refreshTokenEntity, em);
      const refreshToken = await this.refreshTokenRepository.findValidByIdWithUserAndFarmOrFail(refreshTokenEntity.id, em);

      if (refreshToken.farm?.farmUser?.role) {
        refreshToken.farm.farmUser.role.permissions = await this.rolePermissionRepository.findKeysByRoleId(refreshToken.farm?.farmUser?.role.id, em);
      }

      return refreshToken;
    });
  }

  private buildAuthResult(accessToken: IssueAccessTokenResult, refreshToken: RefreshToken): AuthResult {
    return {
      accessToken: accessToken.accessToken,
      expiresIn: accessToken.expiresIn,
      expiresAt: accessToken.expiresAt,
      user: refreshToken.user,
      farm: refreshToken.farm,
      role: refreshToken.farm?.farmUser?.role ?? null,
    };
  }

  async register(command: RegisterCommand, res: Response): Promise<AuthResult> {
    if (await this.userRepository.hasOneByEmail(command.email)) {
      throw new DuplicatedEmailEXception();
    }

    const user = await this.userRepository.save({
      ...command,
      password: await hash(command.password, 10),
      usage: new UserUsage(),
    });

    const accessToken = await this.issueAccessToken(user.id);
    const refreshToken = await this.issueRefreshToken(user.id);

    this.cookieService.setRefreshToken(res, refreshToken.id);

    return this.buildAuthResult(accessToken, refreshToken);
  }

  async login(command: LoginCommand, res: Response): Promise<AuthResult> {
    const user = await this.userRepository.findOneByEmail(command.email);

    if (!user) {
      throw new WrongEmailOrPasswordException();
    }

    if (!(await compare(command.password, user.password))) {
      throw new WrongEmailOrPasswordException();
    }

    const accessToken = await this.issueAccessToken(user.id);
    const refreshToken = await this.issueRefreshToken(user.id);

    this.cookieService.setRefreshToken(res, refreshToken.id);

    return this.buildAuthResult(accessToken, refreshToken);
  }

  async refresh(req: Request, res: Response): Promise<AuthResult> {
    const incomingRefreshTokenId = this.cookieService.parseRefreshToken(req);
    const incomingRefreshToken = isUUID(incomingRefreshTokenId, 4) ? await this.refreshTokenRepository.findValidById(incomingRefreshTokenId) : null;

    if (!incomingRefreshToken) {
      this.cookieService.clearRefreshToken(res);
      throw new InvalidTokenException();
    }

    const accessToken = await this.issueAccessToken(incomingRefreshToken.userId, incomingRefreshToken.farmId);
    const refreshToken = await this.issueRefreshToken(incomingRefreshToken.userId, incomingRefreshToken.farmId, incomingRefreshTokenId);

    this.cookieService.setRefreshToken(res, refreshToken.id);

    return this.buildAuthResult(accessToken, refreshToken);
  }

  async checkIn(command: CheckInCommand, req: Request, res: Response): Promise<AuthResult> {
    const hasFarm = await this.farmUserRepository.has(command.farmId, command.userId);

    if (!hasFarm) {
      throw new FarmNotFoundException();
    }

    const incomingRefreshTokenId = this.cookieService.parseRefreshToken(req);
    const incomingRefreshToken = isUUID(incomingRefreshTokenId, 4) ? await this.refreshTokenRepository.findValidById(incomingRefreshTokenId) : null;

    if (!incomingRefreshToken) {
      this.cookieService.clearRefreshToken(res);
      throw new InvalidTokenException();
    }

    const accessToken = await this.issueAccessToken(command.userId, command.farmId);
    const refreshToken = await this.issueRefreshToken(command.userId, command.farmId, incomingRefreshTokenId);

    this.cookieService.setRefreshToken(res, refreshToken.id);

    return this.buildAuthResult(accessToken, refreshToken);
  }
}
