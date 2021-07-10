import IMailProvider from '../models/IMailProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';

class FakeMailProvider implements IMailProvider {
  private mails: ISendMailDTO[] = [];

  public async sendEmail(message: ISendMailDTO): Promise<void> {
    this.mails.push(message);
  }
}

export default FakeMailProvider;
