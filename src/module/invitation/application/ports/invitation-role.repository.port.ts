export interface InvitationRoleRepositoryPort {
  findDefaultIdOrFail(farmId: string): Promise<string>;
}
