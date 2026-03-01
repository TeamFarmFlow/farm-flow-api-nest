import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { type Request, type Response } from 'express';

import { AuthService } from '../application/auth.service';
import { Public } from '../decorators';

import { LoginRequest, RegisterRequest } from './dto/request';
import { AuthResponse } from './dto/response';

@ApiTags('인증')
@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: '회원가입' })
  @ApiCreatedResponse({ type: AuthResponse })
  async register(@Body() body: RegisterRequest, @Res({ passthrough: true }) res: Response) {
    return AuthResponse.from(await this.authService.register(body.toCommand(), res));
  }

  @Post('login')
  @ApiOperation({ summary: '로그인' })
  @ApiCreatedResponse({ type: AuthResponse })
  async login(@Body() body: LoginRequest, @Res({ passthrough: true }) res: Response) {
    return AuthResponse.from(await this.authService.login(body.toCommand(), res));
  }

  @Post('refresh')
  @ApiOperation({ summary: '토큰 갱신' })
  @ApiCreatedResponse({ type: AuthResponse })
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return AuthResponse.from(await this.authService.refresh(req, res));
  }
}
