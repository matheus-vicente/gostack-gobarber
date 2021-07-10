// import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProvidersDayAvailabilityService from './ListProviderDayAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProvidersAvailability: ListProvidersDayAvailabilityService;

describe('ListProvidersDayAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProvidersAvailability = new ListProvidersDayAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the day availability from provider', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2021, 3, 7, 15, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2021, 3, 7, 16, 0, 0),
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 3, 7, 12).getTime();
    });

    const availability = await listProvidersAvailability.execute({
      provider_id: 'provider',
      day: 7,
      month: 4,
      year: 2021,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 9, available: false },
        { hour: 10, available: false },
        { hour: 11, available: false },
        { hour: 14, available: true },
        { hour: 15, available: false },
        { hour: 16, available: false },
        { hour: 17, available: true },
      ]),
    );
  });
});
