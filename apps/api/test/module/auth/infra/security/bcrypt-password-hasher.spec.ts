import { beforeAll, describe, expect, it } from 'vitest';

import { BcryptPasswordHasher } from '@apps/api/auth/infra';

describe('BcryptPasswordHasher', () => {
  let bcryptPasswordHasher: BcryptPasswordHasher;

  beforeAll(() => {
    bcryptPasswordHasher = new BcryptPasswordHasher();
  });

  it('비밀번호를 암호화한다.', async () => {
    const hashedPassword = await bcryptPasswordHasher.hash('plain-password');

    expect(hashedPassword).toEqual(expect.any(String));
  });

  it('문자열 비밀번호와 해시된 비밀번호가 일치하지 않으면 false를 반환한다.', async () => {
    const plainPassword = 'wrong-password';
    const hashedPassword = '$2b$10$rDbcQlEnmdokKBCDn2c8LOWnCdllUOGyfciEzNaUkDxRhXd1/g3kS';

    const result = await bcryptPasswordHasher.compare(plainPassword, hashedPassword);

    expect(result).toBe(false);
  });

  it('문자열 비밀번호와 해시된 비밀번호가 일치하면 true를 반환한다.', async () => {
    const plainPassword = 'plain-password';
    const hashedPassword = '$2b$10$rDbcQlEnmdokKBCDn2c8LOWnCdllUOGyfciEzNaUkDxRhXd1/g3kS';

    const result = await bcryptPasswordHasher.compare(plainPassword, hashedPassword);

    expect(result).toBe(true);
  });
});
