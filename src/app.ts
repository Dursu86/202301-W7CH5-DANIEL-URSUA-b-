import express from 'express';
import createDebug from 'debug';
import { _dirname } from './config.js';
import morgan from 'morgan';
import cors from 'cors';
import { usersRouter } from './routers/users.router.js';

const debug = createDebug('W7B: index');

export const app = express();
app.disable('x_powered-by');
debug(_dirname);

app.use(morgan('dev'));
app.use(express.static('public'));
const corsOriginis = {
  origin: '*',
};
app.use(cors(corsOriginis));
app.use(express.json());

app.use('/favicon', express.static('../public/favicon.png'));
app.use('/users', usersRouter);
app.use('/', (_req, resp) => {
  resp.send('<h1> Work in progress <h1>');
});
