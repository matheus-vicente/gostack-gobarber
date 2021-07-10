import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';
import AuthenticateUserService from './AuthenticateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let authenticateUser: AuthenticateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });
  it('should be able to authenticate user', async () => {
    const user = await createUser.execute({
      name: 'Matheus Exemplo',
      email: 'emailmatheus@email.com',
      password: '123456',
    });

    const userAuthenticated = await authenticateUser.execute({
      email: 'emailmatheus@email.com',
      password: '123456',
    });

    expect(userAuthenticated).toHaveProperty('token');
    expect(userAuthenticated.user).toEqual(user);
  });

  it('should not be able to authenticate with a non existing user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'emailmatheus@email.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong credentials', async () => {
    await createUser.execute({
      name: 'Matheus Exemplo',
      email: 'emailmatheus@email.com',
      password: '123456',
    });

    await expect(
      authenticateUser.execute({
        email: 'emailmatheus@email.com',
        password: '1234567',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
