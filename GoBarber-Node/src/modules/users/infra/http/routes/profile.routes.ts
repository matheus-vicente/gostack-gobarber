import { Router } from 'express';

import ProfileController from '../controllers/ProfileController';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const profileRouter = Router();
const profileController = new ProfileController();

profileRouter.use(ensureAuthenticated);

profileRouter.get('/', ensureAuthenticated, profileController.show);
profileRouter.put('/', ensureAuthenticated, profileController.update);

export default profileRouter;
