export interface InvitationMailerPort {
  sendInvitation(email: string, code: string, url: string, farmName: string): Promise<void>;
}
