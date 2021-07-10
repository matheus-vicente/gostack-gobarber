import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 3, 8, 12, 0, 0).getTime();
    });

    const appointment = await createAppointment.execute({
      date: new Date(2021, 3, 8, 12, 0, 0),
      user_id: '12345678',
      provider_id: '123123123',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123123123');
  });

  it('should not be able to create an appointment in the same date', async () => {
    const appointmentDate = new Date(2021, 3, 10, 11);

    await createAppointment.execute({
      date: appointmentDate,
      user_id: '12345678',
      provider_id: '123123123',
    });

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        user_id: '12345678',
        provider_id: '123123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment on a passed date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 3, 8, 12, 0, 0).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2021, 3, 8, 11, 0, 0),
        user_id: '12345678',
        provider_id: '123123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 3, 8, 10, 0, 0).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2021, 3, 8, 12, 0, 0),
        user_id: 'same-id',
        provider_id: 'same-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment before 8:00 and after 17:00', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 3, 8, 10, 0, 0).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2021, 3, 9, 7, 0, 0),
        user_id: 'user-id',
        provider_id: 'provider-id',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        date: new Date(2021, 3, 9, 18, 0, 0),
        user_id: 'user-id',
        provider_id: 'provider-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
