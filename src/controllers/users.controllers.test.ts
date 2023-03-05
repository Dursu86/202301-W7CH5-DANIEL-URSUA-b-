import { NextFunction, Response } from 'express';
import { HTTPError } from '../errors/errors.js';
import { RequestPlus } from '../interceptors/logged.js';
import { UsersMongoRepo } from '../repository/users.mongo.repo.js';
import { Auth } from '../services/auth.js';
import { UsersController } from './users.controllers.js';

jest.mock('../config.js', () => ({
  _dirname: 'test',
  config: {
    secret: 'test',
  },
}));

describe('Given the users controller', () => {
  const repo: UsersMongoRepo = {
    create: jest.fn(),
    query: jest.fn(),
    search: jest.fn(),
    queryId: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  const mockReq = {
    body: { id: 'testId', passwd: 'testPass', email: 'testMail' },
  } as unknown as RequestPlus;

  const mockReq1 = {
    body: {},
  } as RequestPlus;

  const mockReq2 = {
    body: { email: 'test' },
  } as RequestPlus;

  const mockReq3 = {
    body: { passwd: 'test' },
  } as RequestPlus;

  const mockResp = {
    status: jest.fn(),
    json: jest.fn(),
  } as unknown as Response;

  const mockNext = jest.fn() as NextFunction;

  const controller = new UsersController(repo);

  describe('When we use the getAll method', () => {
    test('Then it should return all data ', async () => {
      (repo.query as jest.Mock).mockResolvedValue([]);

      await controller.getAll(mockReq, mockResp, mockNext);
      expect(mockResp.json).toHaveBeenCalledWith({ results: [] });
    });
    test('If there is no data it should throw an error', async () => {
      const expectedResult = 'Error';
      (repo.query as jest.Mock).mockRejectedValue(expectedResult);
      await controller.getAll(mockReq, mockResp, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expectedResult);
    });
  });
  describe('When we use the register method', () => {
    test('If there is no email or passwd, it should return an error', async () => {
      await controller.register(mockReq1, mockResp, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        new HTTPError(400, 'Bad request', 'Invalid Email or password')
      );
    });
    test('If there is no passwd, it should return an error', async () => {
      await controller.register(mockReq2, mockResp, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        new HTTPError(400, 'Bad request', 'Invalid Email or password')
      );
    });
    test('If there is no email, it should return an error', async () => {
      await controller.register(mockReq3, mockResp, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        new HTTPError(400, 'Bad request', 'Invalid Email or password')
      );
    });
    test('If the data are correct, then the create method should be called', async () => {
      await controller.register(mockReq, mockResp, mockNext);

      expect(repo.create).toHaveBeenCalled();
    });
    test('If the data are correct, then the create method should be called', async () => {
      await controller.register(mockReq, mockResp, mockNext);

      expect(repo.create).toHaveBeenCalled();
    });
  });
  describe('When we called the login method', () => {
    test('If there is no email and password it should throw an errror', async () => {
      await controller.login(mockReq1, mockResp, mockNext);
      expect(mockNext).toHaveBeenCalledWith(
        new HTTPError(400, 'Bad request', 'Invalid Email or password')
      );
    });
    test('If there is no password it should throw an errror', async () => {
      await controller.login(mockReq2, mockResp, mockNext);
      expect(mockNext).toHaveBeenCalledWith(
        new HTTPError(400, 'Bad request', 'Invalid Email or password')
      );
    });
    test('If there is no email it should throw an errror', async () => {
      await controller.login(mockReq3, mockResp, mockNext);
      expect(mockNext).toHaveBeenCalledWith(
        new HTTPError(400, 'Bad request', 'Invalid Email or password')
      );
    });
    test('If data are correct, it should check if that data exists', async () => {
      await controller.login(mockReq, mockResp, mockNext);
      expect(repo.search).toHaveBeenCalled();
    });
    test('If another user has that data, it should return an error', async () => {
      (repo.search as jest.Mock).mockResolvedValue([]);

      await controller.login(mockReq, mockResp, mockNext);
      expect(mockNext).toHaveBeenCalledWith(
        new HTTPError(401, 'Unauthorized', 'Email not found')
      );
    });
    test('If the data are correct it should check if the passwd is correct', async () => {
      await controller.login(mockReq, mockResp, mockNext);
      expect(mockResp.status).toHaveBeenCalled();
      expect(mockResp.json).toHaveBeenCalled();
    });
  });
});
