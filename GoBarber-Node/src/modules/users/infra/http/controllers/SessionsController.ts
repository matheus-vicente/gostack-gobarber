import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

export default class SessionsControllers {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const authenticatedUserService = container.resolve(AuthenticateUserService);

    const { user, token } = await authenticatedUserService.execute({
      email,
      password,
    });

    const userWithoutPassword = {
      user: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
      token,
    };

    return response.json(userWithoutPassword);
  }
}
