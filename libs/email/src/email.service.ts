import { Injectable } from '@nestjs/common';

import { createTransport, Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import { EmailSendResult } from './types';

@Injectable()
export class EmailService {
  private transporter: Transporter;

  constructor(readonly options: SMTPTransport.Options) {
    this.transporter = createTransport(options);
  }

  async sendInvitationMail(email: string, code: string, url: string, farmName: string) {
    return this.transporter.sendMail({
      from: `"Farm Flow" <${this.options.auth?.user}>`,
      to: email,
      subject: `[Farm Flow] ${farmName} 농장의 초대권이 도착했습니다`,
      html: this.buildInvitationTemplate(url, code, farmName),
    }) as Promise<EmailSendResult>;
  }

  private buildInvitationTemplate(url: string, code: string, farmName: string) {
    return `
    <div style="font-family: Arial, sans-serif; padding: 24px; background:#f7f7f7">
      <div style="max-width:520px;margin:0 auto;background:white;padding:32px;border-radius:10px">

        <h2 style="margin-top:0; text-align: center;">
          ${farmName} 농장에 초대되었습니다 🌱
        </h2>

        <hr style="margin:28px 0;border:none;border-top:1px solid #eee"/>

        <p style="line-height:1.6; text-align: center;">
          <b>${farmName}</b> 농장에 참여할 수 있도록 초대되었습니다.<br/>
          초대 수락 버튼을 클릭하여 아래 코드를 입력해주세요.
        </p>

        <div style="margin:28px 0;text-align:center">
          <a href="${url}"
            style="
              background:#4CAF50;
              color:white;
              padding:14px 28px;
              text-decoration:none;
              border-radius:8px;
              font-weight:bold;
              display:inline-block">
            초대 수락하기
          </a>
        </div>

        <div style="text-align:center;">
          <div style="
            font-size:26px;
            font-weight:bold;
            letter-spacing:6px;
            background:#f4f4f4;
            padding:12px 18px;
            display:inline-block;
            border-radius:8px;
            margin-bottom:2px">
            ${code}
          </div>
        </div>

        <hr style="margin:28px 0;border:none;border-top:1px solid #eee"/>

        <p style="font-size:13px;color:#888;margin:0; text-align: center">
          이 초대장은 <b>10분 후 만료</b>됩니다.
        </p>
      </div>
    </div>`;
  }
}
