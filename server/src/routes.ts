import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import ItemsController from './app/controllers/ItemsController';
import PointsController from './app/controllers/PointsController';

const routes = Router();
const upload = multer(multerConfig);

routes.get('/items', ItemsController.index);

routes.post('/points', upload.single('image'), PointsController.store);
routes.get('/points', PointsController.index);
routes.get('/points/:id', PointsController.show);

export default routes;
