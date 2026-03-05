import { Body, Controller, Delete, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { ApiCreatedResponse, ApiNoContentResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { type Request, type Response } from 'express';

import { ContextService } from '@app/core/context';
import { Public, SkipFarmAuth } from '@app/core/security';
import { toInstance } from '@app/core/transform';

import { AuthService } from '../application';

import { CheckInRequest, LoginRequest, RegisterRequest } from './dto/request';
import { AuthResponse } from './dto/response';

@ApiTags('인증')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly contextService: ContextService,
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: '회원가입' })
  @ApiCreatedResponse({ type: AuthResponse })
  async register(@Body() body: RegisterRequest, @Res({ passthrough: true }) res: Response): Promise<AuthResponse> {
    return toInstance(AuthResponse, await this.authService.register(body.toCommand(), res));
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: '로그인' })
  @ApiCreatedResponse({ type: AuthResponse })
  async login(@Body() body: LoginRequest, @Res({ passthrough: true }) res: Response): Promise<AuthResponse> {
    return toInstance(AuthResponse, await this.authService.login(body.toCommand(), res));
  }

  @Public()
  @Post('refresh')
  @ApiOperation({ summary: '토큰 갱신' })
  @ApiCreatedResponse({ type: AuthResponse })
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<AuthResponse> {
    return toInstance(AuthResponse, await this.authService.refresh(req, res));
  }

  @SkipFarmAuth()
  @Post('checkin')
  @ApiOperation({ summary: '농장 체크인' })
  @ApiCreatedResponse({ type: AuthResponse })
  async checkIn(@Body() body: CheckInRequest, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return toInstance(AuthResponse, await this.authService.checkIn(body.toCommand(this.contextService.userId), req, res));
  }

  @Public()
  @Delete('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '로그아웃' })
  @ApiNoContentResponse()
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.logout(req, res);
  }
}
