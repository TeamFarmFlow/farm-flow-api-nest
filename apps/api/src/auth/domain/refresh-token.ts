import { v4 } from 'uuid';

export class RefreshToken {
  id: string;
  userId: string;
  farmId: string | null;

  key() {
    return `jwt:${this.id}`;
  }

  expiresIn() {
    return 60 * 60 * 24 * 20;
  }

  public static from(id: string) {
    const refreshToken = new RefreshToken();

    refreshToken.id = id;

    return refreshToken;
  }

  public static of(userId: string, farmId: string | null) {
    const refreshToken = new RefreshToken();

    refreshToken.id = v4();
    refreshToken.userId = userId;
    refreshToken.farmId = farmId;

    return refreshToken;
  }
}
