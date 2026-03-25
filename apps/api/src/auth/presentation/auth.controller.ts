import { Body, Controller, Delete, HttpCode, HttpStatus, Inject, Post, Req, Res, UseInterceptors } from '@nestjs/common';
import { ApiCreatedResponse, ApiNoContentResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { type Request, type Response } from 'express';

import { COOKIE_SERVICE, CookieServicePort } from '@libs/cookie';
import { Public, SkipFarmAuth } from '@libs/http';

import { ContextService } from '@apps/api/context';

import { CheckInCommandHandler, LoginCommandHandler, LogoutCommandHandler, RefreshCommandHandler, RegisterCommandHandler } from '../application';

import { CheckInRequest, LoginRequest, RegisterRequest } from './dto/request';
import { AuthResponse } from './dto/response';
import { ClearAuthSessionOnInvalidTokenInterceptor } from './interceptors';

@ApiTags('인증')
@Controller('auth')
@UseInterceptors(ClearAuthSessionOnInvalidTokenInterceptor)
export class AuthController {
  constructor(
    private readonly contextService: ContextService,
    @Inject(COOKIE_SERVICE)
    private readonly cookieService: CookieServicePort,
    private readonly registerCommandHandler: RegisterCommandHandler,
    private readonly loginCommandHandler: LoginCommandHandler,
    private readonly refreshCommandHandler: RefreshCommandHandler,
    private readonly checkInCommandHandler: CheckInCommandHandler,
    private readonly logoutCommandHandler: LogoutCommandHandler,
  ) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: '회원가입' })
  @ApiCreatedResponse({ type: AuthResponse })
  async register(@Body() body: RegisterRequest, @Res({ passthrough: true }) res: Response): Promise<AuthResponse> {
    const result = await this.registerCommandHandler.execute(body.toCommand());

    this.cookieService.setAuthSession(res, result.accessToken, result.refreshToken);

    return AuthResponse.fromResult(result);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: '로그인' })
  @ApiCreatedResponse({ type: AuthResponse })
  async login(@Body() body: LoginRequest, @Res({ passthrough: true }) res: Response): Promise<AuthResponse> {
    this.cookieService.setCacheControl(res);

    const result = await this.loginCommandHandler.execute(body.toCommand());

    this.cookieService.setAuthSession(res, result.accessToken, result.refreshToken);

    return AuthResponse.fromResult(result);
  }

  @Public()
  @Post('refresh')
  @ApiOperation({ summary: '토큰 갱신' })
  @ApiCreatedResponse({ type: AuthResponse })
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<AuthResponse> {
    this.cookieService.setCacheControl(res);

    const result = await this.refreshCommandHandler.execute({ refreshTokenId: this.cookieService.parseRefreshToken(req) });

    this.cookieService.setAuthSession(res, result.accessToken, result.refreshToken);

    return AuthResponse.fromResult(result);
  }

  @SkipFarmAuth()
  @Post('checkin')
  @ApiOperation({ summary: '농장 체크인' })
  @ApiCreatedResponse({ type: AuthResponse })
  async checkIn(@Body() body: CheckInRequest, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    this.cookieService.setCacheControl(res);

    const result = await this.checkInCommandHandler.execute(body.toCommand(this.contextService.userId, this.cookieService.parseRefreshToken(req)));

    this.cookieService.setAuthSession(res, result.accessToken, result.refreshToken);

    return AuthResponse.fromResult(result);
  }

  @Public()
  @Delete('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '로그아웃' })
  @ApiNoContentResponse()
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    this.cookieService.setCacheControl(res);

    await this.logoutCommandHandler.execute({ refreshTokenId: this.cookieService.parseRefreshToken(req) });

    this.cookieService.clearAuthSession(res);
  }
}
