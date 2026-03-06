import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { compare, hash } from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { Request, Response } from 'express';

import { CookieService } from '@app/core/cookies';
import { FarmUserRepository, RolePermissionRepository, UserRepository, UserUsage } from '@app/infra/persistence/typeorm';
import { RedisClient, RefreshTokenSchema } from '@app/infra/redis';
import { JwtClaims } from '@app/shared/security';

import { DuplicatedEmailEXception, InvalidTokenException, WrongEmailOrPasswordException } from '../domain';

import { CheckInCommand, LoginCommand, RegisterCommand } from './command';
import { AuthResult } from './result';

@Injectable()
export class AuthService {
  constructor(
    private readonly redisClient: RedisClient,
    private readonly jwtService: JwtService,
    private readonly cookieService: CookieService,
    private readonly userRepository: UserRepository,
    private readonly farmUserRepository: FarmUserRepository,
    private readonly rolePermissionRepository: RolePermissionRepository,
  ) {}

  private async issueAccessToken(userId: string, farmId: string | null = null): Promise<string> {
    const payload = JwtClaims.from(userId, farmId).toObject();
    const expiresIn = 10 * 60;

    return this.jwtService.signAsync(payload, { expiresIn });
  }

  private async issueRefreshToken(userId: string, farmId: string | null = null) {
    const refreshTokenSchame = RefreshTokenSchema.of(userId, farmId);

    await this.redisClient.setJSON(refreshTokenSchame.key(), refreshTokenSchame);
    await this.redisClient.expire(refreshTokenSchame.key(), refreshTokenSchame.expiresIn());

    return refreshTokenSchame.id;
  }

  private async getRefreshToken(refreshTokenId: string): Promise<RefreshTokenSchema | null> {
    return plainToInstance(RefreshTokenSchema, await this.redisClient.getJSON(RefreshTokenSchema.from(refreshTokenId).key()));
  }

  private async revokeRefreshToken(refreshTokenId: string) {
    return this.redisClient.del(RefreshTokenSchema.from(refreshTokenId).key());
  }

  async register(command: RegisterCommand, res: Response): Promise<AuthResult> {
    if (await this.userRepository.hasOneByEmail(command.email)) {
      throw new DuplicatedEmailEXception();
    }

    const user = await this.userRepository.save({
      email: command.email,
      name: command.name,
      password: await hash(command.password, 10),
      usage: new UserUsage(),
    });

    const accessToken = await this.issueAccessToken(user.id);
    const refreshToken = await this.issueRefreshToken(user.id);

    this.cookieService.setAccessToken(res, accessToken);
    this.cookieService.setRefreshToken(res, refreshToken);

    return { user, farm: null, role: null };
  }

  async login(command: LoginCommand, res: Response): Promise<AuthResult> {
    this.cookieService.setCacheControl(res);

    const user = await this.userRepository.findOneByEmail(command.email);

    if (!user) {
      throw new WrongEmailOrPasswordException();
    }

    if (!(await compare(command.password, user.password))) {
      throw new WrongEmailOrPasswordException();
    }

    const accessToken = await this.issueAccessToken(user.id);
    const refreshToken = await this.issueRefreshToken(user.id);

    this.cookieService.setAccessToken(res, accessToken);
    this.cookieService.setRefreshToken(res, refreshToken);

    return { user, farm: null, role: null };
  }

  async refresh(req: Request, res: Response): Promise<AuthResult> {
    this.cookieService.setCacheControl(res);

    const incomingRefreshTokenId = this.cookieService.parseRefreshToken(req);
    const incomingRefreshToken = await this.getRefreshToken(incomingRefreshTokenId);

    if (!incomingRefreshToken) {
      this.cookieService.clearAccessToken(res);
      this.cookieService.clearRefreshToken(res);
      throw new InvalidTokenException();
    }

    const user = await this.userRepository.findOneById(incomingRefreshToken.userId);
    const farmUser = incomingRefreshToken.farmId ? await this.farmUserRepository.findWithFarmAndRole(incomingRefreshToken.farmId, incomingRefreshToken.userId) : null;

    if (farmUser?.role) {
      farmUser.role.permissions = await this.rolePermissionRepository.findKeysByRoleId(farmUser.role.id);
    }

    await this.revokeRefreshToken(incomingRefreshTokenId);
    const accessToken = await this.issueAccessToken(incomingRefreshToken.userId, incomingRefreshToken.farmId);
    const refreshToken = await this.issueRefreshToken(incomingRefreshToken.userId, incomingRefreshToken.farmId);

    this.cookieService.setAccessToken(res, accessToken);
    this.cookieService.setRefreshToken(res, refreshToken);

    return { user, farm: farmUser?.farm ?? null, role: farmUser?.role ?? null };
  }

  async checkIn(command: CheckInCommand, req: Request, res: Response): Promise<AuthResult> {
    this.cookieService.setCacheControl(res);

    const incomingRefreshTokenId = this.cookieService.parseRefreshToken(req);
    const incomingRefreshToken = await this.getRefreshToken(incomingRefreshTokenId);
    await this.revokeRefreshToken(incomingRefreshTokenId);

    if (!incomingRefreshToken) {
      this.cookieService.clearAccessToken(res);
      this.cookieService.clearRefreshToken(res);
      throw new InvalidTokenException();
    }

    const user = await this.userRepository.findOneById(command.userId);
    const farmUser = await this.farmUserRepository.findWithFarmAndRole(command.farmId, command.userId);

    if (farmUser?.role) {
      farmUser.role.permissions = await this.rolePermissionRepository.findKeysByRoleId(farmUser.role.id);
    }

    const accessToken = await this.issueAccessToken(command.userId, command.farmId);
    const refreshToken = await this.issueRefreshToken(command.userId, command.farmId);

    this.cookieService.setAccessToken(res, accessToken);
    this.cookieService.setRefreshToken(res, refreshToken);

    return { user, farm: farmUser?.farm ?? null, role: farmUser?.role ?? null };
  }

  async logout(req: Request, res: Response): Promise<void> {
    this.cookieService.setCacheControl(res);

    const incomingRefreshTokenId = this.cookieService.parseRefreshToken(req);
    await this.revokeRefreshToken(incomingRefreshTokenId);

    this.cookieService.clearAccessToken(res);
    this.cookieService.clearRefreshToken(res);
  }
}
