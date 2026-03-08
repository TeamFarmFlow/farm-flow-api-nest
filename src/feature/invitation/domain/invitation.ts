import { randomInt } from 'crypto';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const TOKEN_LENGTH = 6;

export class Invitation {
  code: string;
  email: string;
  url: string;
  farmId: string;

  private createCode() {
    let code = '';

    for (let i = 0; i < TOKEN_LENGTH; i++) {
      const index = randomInt(0, CHARS.length);
      code += CHARS[index];
    }

    return code;
  }

  key() {
    return `invitation:${this.code}`;
  }

  expiresIn() {
    return 60 * 10;
  }

  public static from(code: string) {
    const invitation = new Invitation();

    invitation.code = code;

    return invitation;
  }

  public static of(email: string, url: string, farmId: string) {
    const invitation = new Invitation();

    invitation.code = invitation.createCode();
    invitation.email = email;
    invitation.url = url;
    invitation.farmId = farmId;

    return invitation;
  }
}
