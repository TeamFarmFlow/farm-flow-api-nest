export class SendInvitationEmailJob {
  constructor(
    public readonly email: string,
    public readonly code: string,
    public readonly url: string,
    public readonly farmName: string,
  ) {}
}
