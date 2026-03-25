import { JwtService } from '@nestjs/jwt';

import { beforeAll, describe, expect, it } from 'vitest';

import { JwtAccessTokenIssuer } from '@apps/api/auth/infra';

describe('JwtAccessTokenIssuer', () => {
  let jwtService: JwtService;
  let jwtAccessTokenIssuer: JwtAccessTokenIssuer;

  beforeAll(() => {
    jwtService = new JwtService({ secret: 'secretOrPrivateKey' });
    jwtAccessTokenIssuer = new JwtAccessTokenIssuer(jwtService);
  });

  it('JWT를 발급한다.', async () => {
    const token = await jwtAccessTokenIssuer.issue('user-1', 'farm-1');

    expect(token).toEqual(expect.any(String));
  });
});
