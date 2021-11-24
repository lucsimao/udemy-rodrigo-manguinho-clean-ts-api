import { LogMongoRepository } from './log';
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
    errorCollection = await MongoHelper.getCollection('error');
    await errorCollection.deleteMany({});
  });

  test('should create an error log on success', async () => {
    const sut = new LogMongoRepository();
    sut.logError('any_error');
    const count = await errorCollection.countDocuments();

    expect(count).toBe(1);
  });
});
