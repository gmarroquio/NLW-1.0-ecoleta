import express from 'express';
import { resolve } from 'path';
import cors from 'cors';

import routes from './routes';

const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);
app.use('/assets', express.static(resolve(__dirname, 'assets')));

app.listen(3333);
