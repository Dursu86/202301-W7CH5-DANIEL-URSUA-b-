import createDebug from 'debug';
import { User } from '../entities/user';
import { HTTPError } from '../errors/errors.js';
import { Repo } from './repo.interface';
import { UserModel } from './users.mongo.model.js';
const debug = createDebug('W7B:repo:users');

export class UsersMongoRepo implements Repo<User> {
  private static instance: UsersMongoRepo;

  public static getInstance(): UsersMongoRepo {
    if (!UsersMongoRepo.instance) {
      UsersMongoRepo.instance = new UsersMongoRepo();
    }

    return UsersMongoRepo.instance;
  }

  private constructor() {
    debug('Instantiate');
  }

  async query(): Promise<User[]> {
    debug('query');
    const data = await UserModel.find().populate(
      'friends',
      { friends: 0, enemies: 0 },
      'enemies',
      { friends: 0, enemies: 0 }
    );
    return data;
  }

  async queryId(id: string): Promise<User> {
    debug('queryId');
    const data = await UserModel.findById(id).populate(
      'friends',
      { friends: 0, enemies: 0 },
      'enemies',
      { friends: 0, enemies: 0 }
    );
    if (!data)
      throw new HTTPError(404, 'Not found', 'User not found in queryId');
    return data;
  }

  async search(query: { key: string; value: unknown }): Promise<User[]> {
    debug('search');
    const data = await UserModel.find({ [query.key]: query.value });
    return data;
  }

  async create(info: Partial<User>): Promise<User> {
    debug('create');
    const data = await UserModel.create(info);
    return data;
  }

  async update(info: Partial<User>): Promise<User> {
    debug('update');
    const data = await UserModel.findByIdAndUpdate(info.id, info, {
      new: true,
    });
    if (!data) throw new HTTPError(404, 'Not found', 'Id not found in update');
    return data;
  }

  async addFriend(userId: User['id'], friend: User): Promise<User> {
    debug('Add friend');
    const user = await UserModel.findById(userId).populate(
      'friends',
      { friends: 0, enemies: 0 },
      'enemies',
      { friends: 0, enemies: 0 }
    );
    if (!user || !friend)
      throw new HTTPError(400, 'Bad Request', 'User not found');
    user.friends.push(friend);
    UserModel.updateOne({ id: userId }, user);
    return user;
  }

  async addEnemy(userId: User['id'], enemy: User): Promise<User> {
    debug('Add enemy');
    const user = await UserModel.findById(userId).populate(
      'friends',
      { friends: 0, enemies: 0 },
      'enemies',
      { friends: 0, enemies: 0 }
    );
    if (!user || !enemy)
      throw new HTTPError(400, 'Bad Request', 'User not found');
    user.enemies.push(enemy);
    UserModel.updateOne({ id: userId }, user);
    return user;
  }

  async delete(id: string): Promise<void> {
    debug('delete');
    const data = await UserModel.findByIdAndDelete(id);
    if (!data)
      throw new HTTPError(404, 'Not found', 'Delete not posible: id not found');
  }
}
