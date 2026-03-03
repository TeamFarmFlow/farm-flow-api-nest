import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { compareSync, hashSync } from 'bcrypt';
import { isUUID } from 'class-validator';
import { Request, Response } from 'express';

import { CookieService } from '@app/core/cookies';
import { FarmNotFoundException } from '@app/feature/farm/domain';
import { FarmUserRepository, RefreshToken, RefreshTokenRepository, RolePermissionRepository, UserRepository, UserUsage } from '@app/infra/persistence/typeorm';
import { JwtClaims } from '@app/shared/security';

import { DuplicatedEmailEXception, InvalidTokenException, WrongEmailOrPasswordException } from '../domain';

import { CheckInCommand, LoginCommand, RegisterCommand } from './command';
import { AuthResult } from './result';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly cookieService: CookieService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly userRepository: UserRepository,
    private readonly farmUserRepository: FarmUserRepository,
    private readonly rolePermissionRepository: RolePermissionRepository,
  ) {}

  private async issueAccessToken(userId: string, farmId: string | null = null) {
    const payload = JwtClaims.from(userId, farmId).toObject();
    const expiresIn = 10 * 60;
    const expiresAt = new Date(Date.now() + expiresIn * 1000);
    const accessToken = await this.jwtService.signAsync(payload, { expiresIn });

    return { accessToken, expiresIn, expiresAt };
  }

  private async issueRefreshToken(userId: string, farmId?: string): Promise<string> {
    const refreshTokenEntity = RefreshToken.of(userId, farmId);
    await this.refreshTokenRepository.insert(refreshTokenEntity);

    return refreshTokenEntity.id;
  }

  async register(command: RegisterCommand, res: Response): Promise<AuthResult> {
    if (await this.userRepository.hasOneByEmail(command.email)) {
      throw new DuplicatedEmailEXception();
    }

    const user = await this.userRepository.save({
      ...command,
      password: hashSync(command.password, 10),
      usage: new UserUsage(),
    });

    const { accessToken, expiresIn, expiresAt } = await this.issueAccessToken(user.id);
    const refreshToken = await this.issueRefreshToken(user.id);

    this.cookieService.setRefreshToken(res, refreshToken);

    return { accessToken, expiresIn, expiresAt, user, farm: null, role: null };
  }

  async login(command: LoginCommand, res: Response): Promise<AuthResult> {
    const user = await this.userRepository.findOneByEmail(command.email);

    if (!user) {
      throw new WrongEmailOrPasswordException();
    }

    if (!compareSync(command.password, user.password)) {
      throw new WrongEmailOrPasswordException();
    }

    const { accessToken, expiresIn, expiresAt } = await this.issueAccessToken(user.id);
    const refreshToken = await this.issueRefreshToken(user.id);

    this.cookieService.setRefreshToken(res, refreshToken);

    return { accessToken, expiresIn, expiresAt, user, farm: null, role: null };
  }

  async refresh(req: Request, res: Response): Promise<AuthResult> {
    const refreshTokenValue = this.cookieService.parseRefreshToken(req);

    if (!isUUID(refreshTokenValue, 4)) {
      this.cookieService.clearRefreshToken(res);
      throw new InvalidTokenException();
    }

    const currentRefreshToken = await this.refreshTokenRepository.findValidByIdWithUserAndFarm(refreshTokenValue);

    if (!currentRefreshToken) {
      this.cookieService.clearRefreshToken(res);
      throw new InvalidTokenException();
    }

    if (currentRefreshToken.farm?.farmUser?.role) {
      currentRefreshToken.farm.farmUser.role.permissions = await this.rolePermissionRepository.findByRoleId(currentRefreshToken.farm.farmUser.role.id);
    }

    await this.refreshTokenRepository.deleteById(refreshTokenValue);

    const { accessToken, expiresIn, expiresAt } = await this.issueAccessToken(currentRefreshToken.user.id, currentRefreshToken.farm?.id);
    const newRefreshToken = await this.issueRefreshToken(currentRefreshToken.user.id, currentRefreshToken.farm?.id);

    this.cookieService.setRefreshToken(res, newRefreshToken);

    return {
      accessToken,
      expiresIn,
      expiresAt,
      user: currentRefreshToken.user,
      farm: currentRefreshToken.farm,
      role: currentRefreshToken.farm?.farmUser?.role ?? null,
    };
  }

  async checkIn(command: CheckInCommand, req: Request, res: Response): Promise<AuthResult> {
    const refreshTokenValue = this.cookieService.parseRefreshToken(req);

    if (!isUUID(refreshTokenValue, 4)) {
      this.cookieService.clearRefreshToken(res);
      throw new InvalidTokenException();
    }

    const hasFarm = await this.farmUserRepository.has(command.farmId, command.userId);

    if (!hasFarm) {
      throw new FarmNotFoundException();
    }

    const currentRefreshToken = await this.refreshTokenRepository.findValidByIdWithUserAndFarm(refreshTokenValue);

    if (!currentRefreshToken) {
      this.cookieService.clearRefreshToken(res);
      throw new InvalidTokenException();
    }

    await this.refreshTokenRepository.deleteById(refreshTokenValue);

    const { accessToken, expiresIn, expiresAt } = await this.issueAccessToken(command.userId, command.farmId);
    const newRefreshToken = await this.refreshTokenRepository.findValidByIdWithUserAndFarmOrFail(await this.issueRefreshToken(command.userId, command.farmId));

    if (newRefreshToken.farm?.farmUser?.role) {
      newRefreshToken.farm.farmUser.role.permissions = await this.rolePermissionRepository.findByRoleId(newRefreshToken.farm?.farmUser?.role.id);
    }

    this.cookieService.setRefreshToken(res, newRefreshToken.id);

    return {
      accessToken,
      expiresIn,
      expiresAt,
      user: newRefreshToken.user,
      farm: newRefreshToken.farm,
      role: newRefreshToken.farm?.farmUser?.role ?? null,
    };
  }
}
