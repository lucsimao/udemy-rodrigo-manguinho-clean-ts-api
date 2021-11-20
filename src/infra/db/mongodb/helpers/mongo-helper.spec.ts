import { MongoHelper } from './mongo-helper';

const makeSut = () => {
  const sut = MongoHelper;
  return { sut };
};

describe('Mongo Helper', () => {
  beforeAll(async () => {
    const { sut } = makeSut();
    await sut.connect(process.env.MONGO_URL || '');
  });

  it('should reconnect if mongodb is down', async () => {
    const { sut } = makeSut();

    let accountCollection = sut.getCollection('accounts');
    await sut.disconnect();
    accountCollection = sut.getCollection('accounts');

    expect(accountCollection).toBeTruthy();
  });
});
