import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { type Response } from 'express';

import { CookieService } from '@app/core';

import { AuthService } from '../application/auth.service';

import { LoginRequest, RegisterRequest } from './dto/request';
import { AuthResponse } from './dto/response';

@ApiTags('인증')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly cookieService: CookieService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: '회원가입' })
  @ApiCreatedResponse({ type: AuthResponse })
  async register(@Body() body: RegisterRequest, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.register(body.toCommand());

    this.cookieService.setRefreshToken(res, result.refreshToken);

    return AuthResponse.from(result);
  }

  @Post('login')
  @ApiOperation({ summary: '로그인' })
  @ApiCreatedResponse({ type: AuthResponse })
  async login(@Body() body: LoginRequest, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(body.toCommand());

    this.cookieService.setRefreshToken(res, result.refreshToken);

    return AuthResponse.from(result);
  }
}
