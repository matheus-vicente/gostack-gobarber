import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Matheus Exemplo',
      email: 'emailmatheus@email.com',
      password: '123456',
    });

    const updated = await updateProfile.execute({
      user_id: user.id,
      name: 'Exemplo Ferreira',
      email: 'matheusemail@email.com',
    });

    expect(updated.name).toBe('Exemplo Ferreira');
    expect(updated.email).toBe('matheusemail@email.com');
  });

  it('should not be able to update the profile from non-existing user', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'user_id not valid',
        name: 'Matheus Vicente',
        email: 'matheusvicente@email.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'Matheus Exemplo Um',
      email: 'emailmatheus@email.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'Matheus Test',
      email: 'test@email.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Matheus Test',
        email: 'emailmatheus@email.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Matheus Exemplo',
      email: 'emailmatheus@email.com',
      password: '123456',
    });

    const updated = await updateProfile.execute({
      user_id: user.id,
      name: 'Exemplo Ferreira',
      email: 'matheusemail@email.com',
      old_password: '123456',
      password: '123123',
    });

    expect(updated.password).toBe('123123');
  });

  it('should not be able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Matheus Exemplo',
      email: 'emailmatheus@email.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Exemplo Ferreira',
        email: 'matheusemail@email.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Matheus Exemplo',
      email: 'emailmatheus@email.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Exemplo Ferreira',
        email: 'matheusemail@email.com',
        old_password: 'wrong_password',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
