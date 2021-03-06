import { AccountMongoRepository } from './account-repository';
import { Collection } from 'mongodb';
import { MongoHelper } from '../helpers/mongo-helper';

let accountCollection: Collection;

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  test('should return an account on add success', async () => {
    const sut = new AccountMongoRepository();
    const account = await sut.add({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    });

    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe('any_name');
    expect(account.email).toBe('any_email@mail.com');
    expect(account.password).toBe('any_password');
  });

  test('should return an account on loadByEmail success', async () => {
    const sut = new AccountMongoRepository();
    await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    });
    const account = await sut.loadByEmail('any_email@mail.com');

    expect(account).toBeTruthy();
    expect(account?.id).toBeTruthy();
    expect(account?.name).toBe('any_name');
    expect(account?.email).toBe('any_email@mail.com');
    expect(account?.password).toBe('any_password');
  });

  test('should return null if loadByEmail fails', async () => {
    const sut = new AccountMongoRepository();

    const account = await sut.loadByEmail('any_email@mail.com');

    expect(account).toBeFalsy();
  });

  test('should return an account accessToken on updateAccesstoken success', async () => {
    const sut = new AccountMongoRepository();
    const res = await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    });

    const id = res.insertedId.toString();

    await sut.updateAccessToken(id, 'any_token');
    const result = await accountCollection.findOne({
      _id: res.insertedId,
    });

    expect(result).toBeTruthy();
    expect(result?.accessToken).toBe('any_token');
  });
});
