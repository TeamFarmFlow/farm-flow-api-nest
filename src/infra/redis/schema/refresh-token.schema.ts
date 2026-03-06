import { v4 } from 'uuid';

export class RefreshTokenSchema {
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
    const schema = new RefreshTokenSchema();

    schema.id = id;

    return schema;
  }

  public static of(userId: string, farmId: string | null) {
    const schema = new RefreshTokenSchema();

    schema.id = v4();
    schema.userId = userId;
    schema.farmId = farmId;

    return schema;
  }
}
