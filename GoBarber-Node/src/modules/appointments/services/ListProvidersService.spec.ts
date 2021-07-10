// import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    listProviders = new ListProvidersService(fakeUsersRepository);
  });

  it('should be able to list providers', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'Matheus Vicente',
      email: 'matheus@email.com',
      password: '12345678',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'Renato Vicente',
      email: 'renato@email.com',
      password: '12345678',
    });

    const loggedUser = await fakeUsersRepository.create({
      name: 'Odin Vicente',
      email: 'odin@cachorro.com',
      password: '12345678',
    });

    const providers = await listProviders.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual([user1, user2]);
  });
});
