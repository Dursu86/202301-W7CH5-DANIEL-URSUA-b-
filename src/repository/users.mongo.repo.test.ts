import { User } from '../entities/user';
import { UserModel } from './users.mongo.model';
import { UsersMongoRepo } from './users.mongo.repo';

const mockUsers = [
  {
    name: 'test one',
    age: 'test one',
  },
  {
    name: 'test two',
    age: 'test two',
  },
  {
    name: 'test three',
    age: 'test three',
  },
] as User[];

describe('Given the users mongo repo', () => {
  const repo = UsersMongoRepo.getInstance();

  describe('When instantiated', () => {
    test('Then it should be a new instance of class of UsersMongoRepo', () => {
      expect(repo).toBeInstanceOf(UsersMongoRepo);
    });
  });

  describe('When we use the query method', () => {
    test('Then it should return all data', async () => {
      (UserModel.find as jest.Mock).mockImplementation(() => ({
        populate: jest.fn().mockResolvedValue(mockUsers),
      }));

      const element = await repo.query();

      expect(UserModel.find).toHaveBeenCalled();
      expect(element).toEqual(mockUsers);
    });
  });
});
