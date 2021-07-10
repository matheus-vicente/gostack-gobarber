import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import ResetPasswordService from './ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let resetPasswordService: ResetPasswordService;

describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    fakeHashProvider = new FakeHashProvider();

    resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );
  });

  it('should be able to reset the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Matheus',
      email: 'matheus@email.com',
      password: '123456789',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPasswordService.execute({
      password: '123123123',
      token,
    });

    const updatedUser = await fakeUsersRepository.findById(user.id);

    expect(updatedUser?.password).toBe('123123123');
    expect(generateHash).toHaveBeenCalledWith('123123123');
  });

  it('should not be able to reset the password with an un-existing token', async () => {
    await expect(
      resetPasswordService.execute({
        token: 'token-not-exists',
        password: '121122123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password with an un-existing user', async () => {
    const { token } = await fakeUserTokensRepository.generate(
      'users-not-exists',
    );

    await expect(
      resetPasswordService.execute({
        token,
        password: '121122123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password is passed more than 2 hours', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Matheus',
      email: 'matheus@email.com',
      password: '123123123',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPasswordService.execute({
        token,
        password: '121122123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
