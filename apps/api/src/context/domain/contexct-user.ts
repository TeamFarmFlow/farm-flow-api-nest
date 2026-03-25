export class ContextUser {
  userId: string;
  farmId: string;

  public static from(userId: string, farmId: string | null) {
    const contextUser = new ContextUser();

    contextUser.userId = userId;
    contextUser.farmId = farmId ?? '';

    return contextUser;
  }
}
