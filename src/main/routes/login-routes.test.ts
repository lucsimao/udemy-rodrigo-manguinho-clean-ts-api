import { Collection } from 'mongodb';
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper';
import app from '../config/app';
import { hash } from 'bcrypt';
import request from 'supertest';

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  let accountCollection: Collection;

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  describe('POST /signup', () => {
    test('should return 200', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Lucas',
          email: 'lucas@gmail.com',
          password: '123',
          passwordConfirmation: '123',
        })
        .expect(200);
    });
  });

  describe('POST /login', () => {
    test('should return 200', async () => {
      const password = await hash('123', 12);
      await accountCollection.insertOne({
        name: 'Lucas',
        email: 'lucas@gmail.com',
        password: password,
      });

      await request(app)
        .post('/api/login')
        .send({
          email: 'lucas@gmail.com',
          password: '123',
        })
        .expect(200);
    });

    test('should return 401', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'lucas@gmail.com',
          password: '123',
        })
        .expect(401);
    });
  });
});
