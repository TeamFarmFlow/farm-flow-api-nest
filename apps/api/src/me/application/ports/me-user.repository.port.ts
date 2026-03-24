export interface MeUserRepositoryPort {
  updateName(userId: string, name: string): Promise<void>;
}
