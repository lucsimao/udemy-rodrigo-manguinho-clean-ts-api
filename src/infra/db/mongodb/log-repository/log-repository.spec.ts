import { LogMongoRepository } from './log-repository';
import { MongoHelper } from '../helpers/mongo-helper';

describe('Log Mongo Repository', () => {
  let errorCollection;

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors');
    await errorCollection.deleteMany({});
  });

  test('should create an error log on success', async () => {
    const sut = new LogMongoRepository();

    await sut.logError('any_error');
    const result = await errorCollection.countDocuments();

    expect(result).toBe(1);
  });
});
