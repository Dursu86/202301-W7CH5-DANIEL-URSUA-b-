import { Router } from 'express';
import { UsersController } from '../controllers/users.controllers.js';
import { UsersMongoRepo } from '../repository/users.mongo.repo.js';
import createDebug from 'debug';
import { logged } from '../interceptors/logged.js';
const debug = createDebug('W7B:router:users');

// eslint-disable-next-line new-cap
export const usersRouter = Router();
debug('loaded');

const repo = UsersMongoRepo.getInstance();
const controller = new UsersController(repo);

usersRouter.get('/', logged, controller.getAll.bind(controller));
usersRouter.post('/register', controller.register.bind(controller));
usersRouter.post('/login', controller.login.bind(controller));
usersRouter.patch('/addfriend/:id', controller.addFavs.bind(controller));

// UsersRouter.patch('/changefav/:id', controller.changeFav.bind(controller));
// usersRouter.patch('/deletefav/:id', controller.deleteFav.bind(controller));
