import { AccountModel } from '../add-account/db-add-account-protocols';
import { AuthenticationModel } from '../../../domain/use-cases/authentication';
import { DbAuthentication } from './db-authentication';
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository';

const makeFakeAccount = (): AccountModel => {
  return {
    id: 'any_id',
    email: 'any_email@mail.com',
    name: 'any_name',
    password: 'any_password',
  };
};

const makeLoadAccountByEmailRepositoryStub = () => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository
  {
    async load(email: string): Promise<AccountModel> {
      const account = makeFakeAccount();
      return account;
    }
  }
  return new LoadAccountByEmailRepositoryStub();
};

const makeSut = () => {
  const loadAccountByEmailRepository = makeLoadAccountByEmailRepositoryStub();
  const sut = new DbAuthentication(loadAccountByEmailRepository);
  return { sut, loadAccountByEmailRepository };
};

const makeFakeAuthentication = (): AuthenticationModel => {
  return {
    email: 'any_email@mail.com',
    password: 'any_password',
  };
};

describe('DbAuthentication Tests', () => {
  it('Should call LoadAccountByEmailRepository with correct email', () => {
    const { sut, loadAccountByEmailRepository } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepository, 'load');
    sut.auth(makeFakeAuthentication());
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  it('Should throw when LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut();
    const loadSpy = jest
      .spyOn(loadAccountByEmailRepository, 'load')
      .mockRejectedValueOnce(new Error());
    const promise = sut.auth(makeFakeAuthentication());
    await expect(promise).rejects.toThrow();
  });
});
