import { Injectable } from '@nestjs/common';

import { createTransport, Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import { MailSendResult } from './types';

@Injectable()
export class MailService {
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
    }) as Promise<MailSendResult>;
  }

  private buildInvitationTemplate(url: string, code: string, farmName: string) {
    return `
    <div style="font-family: Arial, sans-serif; padding: 24px; background:#f7f7f7">
      <div style="max-width:520px;margin:0 auto;background:white;padding:32px;border-radius:10px">

        <h2 style="margin-top:0">
          ${farmName} 농장에 초대되었습니다 🌱
        </h2>

        <p style="line-height:1.6">
          안녕하세요.<br/>
          <b>${farmName}</b> 농장에 참여할 수 있도록 초대되었습니다.<br/>
          아래 버튼을 눌러 초대를 수락해주세요.
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

        <p style="margin-bottom:8px">
          버튼이 작동하지 않는 경우 아래 초대 코드를 입력해주세요.
        </p>

        <div style="text-align:center;">
          <div style="
            font-size:26px;
            font-weight:bold;
            letter-spacing:6px;
            background:#f4f4f4;
            padding:12px 18px;
            display:inline-block;
            border-radius:8px;
            margin-bottom:16px">
            ${code}
          </div>
        </div>

        <p style="margin-top:24px;font-size:14px;color:#666">
          또는 아래 링크를 브라우저에 직접 입력할 수도 있습니다.
        </p>


        <div style="text-align:center;">
          <div style="
            font-size:13px;
            word-break:break-all;
            color:#4CAF50">
            ${url}
          </div>
        </div>

        <hr style="margin:28px 0;border:none;border-top:1px solid #eee"/>

        <p style="font-size:13px;color:#888;margin:0">
          이 초대장은 <b>10분 후 만료</b>됩니다.
        </p>

      </div>
    </div>`;
  }
}
