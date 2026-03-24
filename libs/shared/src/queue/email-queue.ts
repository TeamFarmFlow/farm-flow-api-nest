export const SEND_INVITATION_EMAIL_JOB = 'send-invitation-email';

export interface SendInvitationEmailJobData {
  email: string;
  code: string;
  url: string;
  farmName: string;
}
