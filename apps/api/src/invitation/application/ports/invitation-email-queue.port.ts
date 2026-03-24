export interface InvitationEmailQueuePort {
  add(email: string, code: string, url: string, farmName: string): Promise<void>;
}
