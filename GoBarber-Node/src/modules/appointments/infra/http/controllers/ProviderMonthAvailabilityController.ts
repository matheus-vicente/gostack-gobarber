import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';

export default class ProvidersMonthAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;
    const { month, year } = request.body;

    const listProvidersAvailability = container.resolve(
      ListProviderMonthAvailabilityService,
    );

    const availability = await listProvidersAvailability.execute({
      provider_id,
      month,
      year,
    });

    return response.json(availability);
  }
}
