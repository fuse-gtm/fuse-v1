import { Logger } from '@nestjs/common';

import { Resend } from 'resend';
import { instrumentResend } from '@kubiks/otel-resend';
import {
  type SendMailOptions,
} from 'nodemailer';

import { type EmailDriverInterface } from 'src/engine/core-modules/email/drivers/interfaces/email-driver.interface';

export class ResendDriver implements EmailDriverInterface {
  private readonly logger = new Logger(ResendDriver.name);
  private client: ReturnType<typeof instrumentResend>;

  constructor(apiKey: string) {
    const resend = new Resend(apiKey);
    this.client = instrumentResend(resend);
  }

  async send(sendMailOptions: SendMailOptions): Promise<void> {
    try {
      const to = Array.isArray(sendMailOptions.to)
        ? sendMailOptions.to
        : [sendMailOptions.to];

      const result = await this.client.emails.send({
        from: sendMailOptions.from as string,
        to: to.map((addr) =>
          typeof addr === 'string' ? addr : addr.address,
        ),
        subject: sendMailOptions.subject as string,
        html: sendMailOptions.html as string,
        text: sendMailOptions.text as string,
      });

      this.logger.log(
        `Email to '${sendMailOptions.to}' successfully sent via Resend (ID: ${result.data?.id})`,
      );
    } catch (err) {
      this.logger.error(
        `Error sending email to '${sendMailOptions.to}' via Resend: ${err}`,
      );
      throw err;
    }
  }
}
