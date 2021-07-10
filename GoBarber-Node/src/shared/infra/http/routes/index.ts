import { Router } from 'express';

import appointmentsRouter from '@modules/appointments/infra/http/routes/appointments.routes';
import providersRouter from '@modules/appointments/infra/http/routes/providers.routes';

import usersRouter from '@modules/users/infra/http/routes/users.routes';
import sessionRouter from '@modules/users/infra/http/routes/session.routes';
import passwordsRouter from '@modules/users/infra/http/routes/passwords.routes';
import profileRouter from '@modules/users/infra/http/routes/profile.routes';

const routes = Router();

routes.use('/session', sessionRouter);
routes.use('/users', usersRouter);
routes.use('/password', passwordsRouter);
routes.use('/profile', profileRouter);
routes.use('/appointments', appointmentsRouter);
routes.use('/providers', providersRouter);

export default routes;
