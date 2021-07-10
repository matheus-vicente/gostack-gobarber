import AppError from '@shared/errors/AppError';

import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let forgotEmailService: SendForgotPasswordEmailService;

describe('ForgotEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    forgotEmailService = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );
  });

  it('should be able to recover your password using your email', async () => {
    const sendEmail = jest.spyOn(fakeMailProvider, 'sendEmail');

    await fakeUsersRepository.create({
      name: 'Eu mesmo',
      email: 'eu@eu.com.br',
      password: '12345678',
    });

    await forgotEmailService.execute({
      email: 'eu@eu.com.br',
    });

    expect(sendEmail).toBeCalled();
  });

  it('should not be able to recover passwords from a non-existing user', async () => {
    await expect(
      forgotEmailService.execute({
        email: 'eu@eu.com.br',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
    const userTokens = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUsersRepository.create({
      name: 'Matheus',
      email: 'matheus@email.com',
      password: '12345678',
    });

    await forgotEmailService.execute({
      email: 'matheus@email.com',
    });

    expect(userTokens).toHaveBeenCalledWith(user.id);
  });
});
