import { Request, Response, Router } from 'express';
import auth from './middlewares/auth';

/*
    Controllers imports
*/

import { sessionController } from './controllers/session.controller';
import { placesController } from './controllers/places.controller';

export const router = Router();

/*
    Adding routes from controllers
*/
router.get('/', (_req: Request, res: Response) => { res.send('❤️'); });
router.use('/login', sessionController);
router.use(auth);
router.use('/places', placesController);
