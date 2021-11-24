import {
  AccountModel,
  AddAccountModel,
  AddAccountRepository,
  Encrypter,
} from './db-add-account-protocols';

import { DbAddAccount } from './db-add-account';

interface SutTypes {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
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

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve('hashed_password'));
    }
  }
  return new EncrypterStub();
};

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);

  return { encrypterStub, sut, addAccountRepositoryStub };
};
describe('DbAddAccount Usecase', () => {
  test('should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut();

    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');
    const accountData = makeFakeAccount();

    await sut.add(accountData);

    expect(encryptSpy).toHaveBeenCalledWith('hashed_password');
  });

  test('should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut();

    jest.spyOn(encrypterStub, 'encrypt').mockRejectedValueOnce(new Error());
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
