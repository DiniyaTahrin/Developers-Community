import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendPostDislikeWarning(to: string, postTitle: string) {
    await this.transporter.sendMail({
      from: `"Dev Community" <${process.env.EMAIL_USER}>`,
      to,
      subject: '⚠️ Your post received 10 dislikes',
      html: `
        <p>Hi,</p>
        <p>Your post <b>"${postTitle}"</b> has received more than <b>10 dislikes</b>.</p>
        <p>You may want to review or improve it.</p>
        <br/>
        <p>– Dev Community Team</p>
      `,
    });
  }
}
