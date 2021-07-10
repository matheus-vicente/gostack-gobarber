import {
  createTestAccount,
  createTransport,
  getTestMessageUrl,
  Transporter,
} from 'nodemailer';
import { injectable, inject } from 'tsyringe';

import ISendMailDTO from '../dtos/ISendMailDTO';

import IMailProvider from '../models/IMailProvider';
import IMailTemplateProvider from '../../MailTemplateProvider/models/IMailTemplateProvider';

@injectable()
class EtherialMailProvider implements IMailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailProvider: IMailTemplateProvider,
  ) {
    createTestAccount().then(account => {
      const transporter = createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });

      console.log(account);

      this.client = transporter;
    });
  }

  public async sendEmail({
    to,
    from,
    subject,
    templateDate,
  }: ISendMailDTO): Promise<void> {
    const message = await this.client.sendMail({
      from: {
        name: from?.name || 'Equipe GoBarber',
        address: from?.email || 'equipe@gobarber.com.br',
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await this.mailProvider.parse(templateDate),
    });

    console.log('Message sent: %s', message.messageId);
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', getTestMessageUrl(message));
  }
}

export default EtherialMailProvider;
