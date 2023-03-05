import { User } from '../entities/user';
import { UserModel } from './users.mongo.model';
import { UsersMongoRepo } from './users.mongo.repo';

jest.mock('./users.mongo.model.ts');
const mockUsers = [
  {
    id: '0',
    name: 'test one',
    age: 'test one',
  },
  {
    id: '1',
    name: 'test two',
    age: 'test two',
  },
  {
    id: '2',
    name: 'test three',
    age: 'test three',
  },
] as unknown as User[];

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
        populate: jest.fn().mockReturnValue(mockUsers),
      }));

      const element = await repo.query();

      expect(UserModel.find).toHaveBeenCalled();
      expect(element).toEqual(mockUsers);
    });
  });

  describe('When we use the query Id method', () => {
    test('Then it should return one register', async () => {
      (UserModel.findById as jest.Mock).mockImplementation(() => ({
        populate: jest.fn().mockResolvedValue(mockUsers[2]),
      }));

      const element = await repo.queryId('2');

      expect(UserModel.findById).toHaveBeenCalled();
      expect(element).toEqual(mockUsers[2]);
    });

    test('If the user does not exist, it should return an error', async () => {
      (UserModel.findById as jest.Mock).mockImplementation(() => ({
        populate: jest.fn().mockResolvedValue(undefined),
      }));

      const element = repo.queryId('2');

      await expect(element).rejects.toThrow();
    });
  });

  describe('When we use the searched method', () => {
    test('If the user is registered then it appears', async () => {
      (UserModel.find as jest.Mock).mockResolvedValue(mockUsers[1]);

      const element = await repo.search({ key: 'name', value: 'test two' });

      expect(UserModel.find).toHaveBeenCalled();
      expect(element).toEqual(mockUsers[1]);
    });
  });

  describe('When we use the create method', () => {
    test('If we add  any data, it should be added', async () => {
      (UserModel.create as jest.Mock).mockResolvedValue({ name: 'test' });

      const element = await repo.create({ name: 'test' });

      expect(UserModel.create).toHaveBeenCalled();
      expect(element).toEqual({ name: 'test' });
    });
  });

  describe('When we use the update method', () => {
    test('If the id exist, it should return the data', async () => {
      (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({
        id: '1',
      });
      const result = {
        id: '1',
        name: 'test one',
      };
      const element = await repo.update(result);
      expect(UserModel.findByIdAndUpdate).toHaveBeenCalled();
      expect(element).toEqual({ id: '1' });
    });
    test('If the id does not exist, it should throw an error', async () => {
      (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(undefined);
      const result = {
        id: '1',
        name: 'test one',
      };
      const element = repo.update(result);
      await expect(element).rejects.toThrow();
    });
  });

  describe('When we use the delete method', () => {
    test('It should delete the element', async () => {
      (UserModel.findByIdAndDelete as jest.Mock).mockResolvedValue({ id: '1' });
      repo.delete('{id: 1}');

      expect(UserModel.findByIdAndDelete).toHaveBeenCalled();
    });
    test('If it does not exist, it should throw an error', async () => {
      (UserModel.findByIdAndDelete as jest.Mock).mockResolvedValue(undefined);
      const element = repo.delete('{id: 1}');
      await expect(element).rejects.toThrow();
    });
  });
});
