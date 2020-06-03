import { Router } from 'express';

import ItemsController from './app/controllers/ItemsController';
import PointsController from './app/controllers/PointsController';

const routes = Router();

routes.get('/items', ItemsController.index);

routes.post('/points', PointsController.store);
routes.get('/points', PointsController.index);
routes.get('/points/:id', PointsController.show);

export default routes;
