export interface InvitationEmailSenderPort {
  send(email: string, code: string, url: string, farmName: string): Promise<void>;
}
