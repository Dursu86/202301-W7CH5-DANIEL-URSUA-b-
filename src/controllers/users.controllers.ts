import { Response, Request, NextFunction } from 'express';
import createDebug from 'debug';
import { User } from '../entities/user';
import { Repo } from '../repository/repo.interface';
import { HTTPError } from '../errors/errors.js';
import { Auth, PayloadToken } from '../services/auth.js';
import { RequestPlus } from '../interceptors/logged';
const debug = createDebug('W7B:controller:users');
export class UsersController {
  constructor(public repo: Repo<User>) {
    debug('Instantiate');
  }

  async getAll(_req: Request, resp: Response, next: NextFunction) {
    try {
      debug('getAll');
      const data = await this.repo.query();
      resp.json({
        results: data,
      });
    } catch (error) {
      next(error);
    }
  }

  async register(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('register:post');
      if (!req.body.email || !req.body.passwd)
        throw new HTTPError(400, 'Bad request', 'Invalid Email or password');
      req.body.passwd = await Auth.hash(req.body.passwd);
      req.body.friends = [];
      req.body.enemies = [];
      const data = await this.repo.create(req.body);
      resp.status(201);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('login:post');
      if (!req.body.email || !req.body.passwd)
        throw new HTTPError(400, 'Bad request', 'Invalid Email or password');
      const data = await this.repo.search({
        key: 'email',
        value: req.body.email,
      });
      if (!data.length)
        throw new HTTPError(401, 'Unauthorized', 'Email not found');
      if (!(await Auth.compare(req.body.passwd, data[0].passwd)))
        throw new HTTPError(401, 'Unauthorized', 'Password not match');
      const payload: PayloadToken = {
        id: data[0].id,
        email: data[0].email,
        role: 'user',
      };
      const token = Auth.createJWT(payload);
      resp.status(202);
      resp.json({
        token,
      });
    } catch (error) {
      next(error);
    }
  }

  async addFriend(req: RequestPlus, resp: Response, next: NextFunction) {
    try {
      debug('Add friend');
      if (!req.info || !req.body.id)
        throw new HTTPError(401, 'Unauthorized', 'Information incomplete');
      const user = await this.repo.queryId(req.info.id);
      if (!user)
        throw new HTTPError(401, 'Unathorized', 'Information incomplete');
      if (user.friends.find(req.body.id))
        throw new Error('User already registered');
      user.friends.push(req.body.id);
      this.repo.update(user);
    } catch (error) {
      next(error);
    }
  }

  async addEnemy(req: RequestPlus, resp: Response, next: NextFunction) {
    try {
      debug('Add enemy');
      if (!req.info || !req.body.id)
        throw new HTTPError(401, 'Unauthorized', 'Information incomplete');
      const user = await this.repo.queryId(req.info.id);
      if (!user)
        throw new HTTPError(401, 'Unathorized', 'Information incomplete');
      if (user.enemies.find(req.body.id))
        throw new Error('User already registered');
      user.enemies.push(req.body.id);
      this.repo.update(user);
    } catch (error) {
      next(error);
    }
  }
}
