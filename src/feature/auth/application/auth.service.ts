import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { compareSync, hashSync } from 'bcrypt';

import { User, UserRepository } from '@app/feature/user';

import { DuplicatedEmailEXception, RefreshToken, RefreshTokenRepository, WrongEmailOrPasswordException } from '../domain';
import { JwtClaims } from '../infrastructure/jwt';

import { LoginCommand, RegisterCommand } from './command';
import { AuthResult } from './result';

@Injectable()
export class AuthService {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  private async issueAccessToken(user: User) {
    const jwtClaims = JwtClaims.fromUser(user).toObject();
    const expiresIn = 10 * 60;
    const expiresAt = new Date(Date.now() + expiresIn * 1000);
    const accessToken = await this.jwtService.signAsync(jwtClaims, { expiresIn });

    return { accessToken, expiresIn, expiresAt };
  }

  private async issueRefreshToken(user: User): Promise<string> {
    const refreshTokenEntity = RefreshToken.of(user.id);
    await this.refreshTokenRepository.insert(refreshTokenEntity);

    return refreshTokenEntity.id;
  }

  async register(command: RegisterCommand): Promise<AuthResult> {
    if (await this.userRepository.hasOneByEmail(command.email)) {
      throw new DuplicatedEmailEXception();
    }

    const user = await this.userRepository.save(User.ownerOf({ ...command, password: hashSync(command.password, 10) }));

    const accessToken = await this.issueAccessToken(user);
    const refreshToken = await this.issueRefreshToken(user);

    return {
      refreshToken,
      accessToken: accessToken.accessToken,
      expiresIn: accessToken.expiresIn,
      expiresAt: accessToken.expiresAt,
      user,
    };
  }

  async login(command: LoginCommand): Promise<AuthResult> {
    const user = await this.userRepository.findOneByEmail(command.email);

    if (!user) {
      throw new WrongEmailOrPasswordException();
    }

    if (!compareSync(command.password, user.password)) {
      throw new WrongEmailOrPasswordException();
    }

    const accessToken = await this.issueAccessToken(user);
    const refreshToken = await this.issueRefreshToken(user);

    return {
      refreshToken,
      accessToken: accessToken.accessToken,
      expiresIn: accessToken.expiresIn,
      expiresAt: accessToken.expiresAt,
      user,
    };
  }
}
