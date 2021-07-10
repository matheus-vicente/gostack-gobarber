import { injectable, inject } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';

// import AppError from '@shared/errors/AppError';

// import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppoinrmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

type IResponse = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
class ListProviderDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppoinrmentsRepository,
  ) {}

  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
      {
        provider_id,
        day,
        month,
        year,
      },
    );

    const hourStart = 8;

    const eachHourArray = Array.from(
      { length: 10 },
      (_, index) => index + hourStart,
    );

    const currentDate = new Date(Date.now());

    const availabilityArray = eachHourArray.map(hour => {
      const hasAppointment = appointments.find(
        appointment => getHours(appointment.date) === hour,
      );

      const compareDate = new Date(year, month - 1, day, hour);

      return {
        hour,
        available: !hasAppointment && isAfter(compareDate, currentDate),
      };
    });

    return availabilityArray;
  }
}

export default ListProviderDayAvailabilityService;
