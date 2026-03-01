import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthService } from '../application/auth.service';

import { LoginRequest, RegisterRequest } from './dto/request';
import { AuthResponse } from './dto/response';

@ApiTags('인증')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: '회원가입' })
  @ApiCreatedResponse({ type: AuthResponse })
  async register(@Body() body: RegisterRequest) {
    return AuthResponse.from(await this.authService.register(body.toCommand()));
  }

  @Post('login')
  @ApiOperation({ summary: '로그인' })
  @ApiCreatedResponse({ type: AuthResponse })
  async login(@Body() body: LoginRequest) {
    return AuthResponse.from(await this.authService.login(body.toCommand()));
  }
}
