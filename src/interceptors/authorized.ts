import { NextFunction, Response } from 'express';
import { RequestPlus } from './logged.js';
import createDebug from 'debug';
import { ThingsMongoRepo } from '../repository/things.mongo.repo.js';
import { HTTPError } from '../errors/errors.js';
const debug = createDebug('W6:interceptor:authorized');
export async function authorized(
  req: RequestPlus,
  resp: Response,
  next: NextFunction,
  thingsRepo: ThingsMongoRepo
) {
  try {
    debug('Called');
    if (!req.info)
      throw new HTTPError(
        498,
        'Token not found',
        'Token not found in Authorized interceptor'
      );
    const userId = req.info.id;

    next();
  } catch (error) {
    next(error);
  }
}
