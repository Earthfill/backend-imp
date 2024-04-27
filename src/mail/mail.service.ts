import { Injectable } from '@nestjs/common';
import { MailDto } from './dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendEmail(mailDto: MailDto) {
    return await this.mailerService.sendMail(mailDto);
  }
}
