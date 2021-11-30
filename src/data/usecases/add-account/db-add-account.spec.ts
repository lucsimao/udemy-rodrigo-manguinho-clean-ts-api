import {
  AccountModel,
  AddAccountModel,
  AddAccountRepository,
  Hasher,
} from './db-add-account-protocols';

import { DbAddAccount } from './db-add-account';

interface SutTypes {
  sut: DbAddAccount;
  HasherStub: Hasher;
  addAccountRepositoryStub: AddAccountRepository;
}

const makeFakeAccount = () => {
  return {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email',
    password: 'hashed_password',
  };
};

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(_account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = makeFakeAccount();
      return new Promise((resolve) => resolve(fakeAccount));
    }
  }
  return new AddAccountRepositoryStub();
};

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash(value: string): Promise<string> {
      return new Promise((resolve) => resolve('hashed_password'));
    }
  }
  return new HasherStub();
};

const makeSut = (): SutTypes => {
  const HasherStub = makeHasher();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const sut = new DbAddAccount(HasherStub, addAccountRepositoryStub);

  return { HasherStub, sut, addAccountRepositoryStub };
};
describe('DbAddAccount Usecase', () => {
  test('should call Hasher with correct password', async () => {
    const { sut, HasherStub } = makeSut();

    const HasherSpy = jest.spyOn(HasherStub, 'hash');
    const accountData = makeFakeAccount();

    await sut.add(accountData);

    expect(HasherSpy).toHaveBeenCalledWith('hashed_password');
  });

  test('should throw if Hasher throws', async () => {
    const { sut, HasherStub } = makeSut();

    jest.spyOn(HasherStub, 'hash').mockRejectedValueOnce(new Error());
    const accountData = makeFakeAccount();

    const promise = sut.add(accountData);

    await expect(promise).rejects.toThrow();
  });

  test('should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();

    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');
    const accountData = makeFakeAccount();

    await sut.add(accountData);

    expect(addSpy).toHaveBeenCalledWith(makeFakeAccount());
  });

  test('should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();

    jest
      .spyOn(addAccountRepositoryStub, 'add')
      .mockRejectedValueOnce(new Error());
    const accountData = makeFakeAccount();

    const promise = sut.add(accountData);

    await expect(promise).rejects.toThrow();
  });

  test('should return an account on success', async () => {
    const { sut } = makeSut();

    const accountData = makeFakeAccount();
    const account = await sut.add(accountData);

    expect(account).toEqual(makeFakeAccount());
  });
});
