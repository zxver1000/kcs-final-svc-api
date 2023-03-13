import { MailerService } from '@nestjs-modules/mailer';
import { HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailService: MailerService) {}
  async sendMail(password: string, userEmail: string): Promise<number> {
    this.mailService
      .sendMail({
        to: 'wlwhs5014@naver.com',
        from: 'wlwhs3154@gmail.com',
        subject: '안녕하세요 KuDaily 입니다.',
        text: '변경된 비밀번호는 ' + password,
      })
      .catch((e) => {
        return HttpStatus.INTERNAL_SERVER_ERROR;
      });
    return 200;
  }
}
