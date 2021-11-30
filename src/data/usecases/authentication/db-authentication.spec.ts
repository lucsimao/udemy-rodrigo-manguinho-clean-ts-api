import { AccountModel } from '../add-account/db-add-account-protocols';
import { AuthenticationModel } from '../../../domain/use-cases/authentication';
import { DbAuthentication } from './db-authentication';
import { HashComparer } from '../../protocols/criptography/hash-comparer';
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository';
import { TokenGenerator } from '../../protocols/criptography/token-generator';

const makeFakeAccount = (): AccountModel => {
  return {
    id: 'any_id',
    email: 'any_email@mail.com',
    name: 'any_name',
    password: 'hashed_password',
  };
};

const makeLoadAccountByEmailRepositoryStub = () => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository
  {
    async load(email: string): Promise<AccountModel | null> {
      const account = makeFakeAccount();
      return account;
    }
  }
  return new LoadAccountByEmailRepositoryStub();
};

const makeHashComparer = () => {
  class HashComparerStub implements HashComparer {
    async compare(value: string, hash: string): Promise<boolean> {
      return true;
    }
  }
  return new HashComparerStub();
};

const makeTokenGenerator = () => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate(id: string): Promise<string> {
      return 'any_token';
    }
  }
  return new TokenGeneratorStub();
};

const makeSut = () => {
  const loadAccountByEmailRepository = makeLoadAccountByEmailRepositoryStub();
  const hashComparerStub = makeHashComparer();
  const tokenGeneratorStub = makeTokenGenerator();
  const sut = new DbAuthentication(
    loadAccountByEmailRepository,
    hashComparerStub,
    tokenGeneratorStub
  );
  return {
    sut,
    loadAccountByEmailRepository,
    hashComparerStub,
    tokenGeneratorStub,
  };
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
    jest
      .spyOn(loadAccountByEmailRepository, 'load')
      .mockRejectedValueOnce(new Error());
    const promise = sut.auth(makeFakeAuthentication());
    await expect(promise).rejects.toThrow();
  });

  it('Should return null when LoadAccountByEmailRepository return null', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepository, 'load')
      .mockResolvedValueOnce(null);

    const accessToken = await sut.auth(makeFakeAuthentication());
    expect(accessToken).toBeNull;
  });

  it('Should call HashComparer with correct password', async () => {
    const { sut, hashComparerStub } = makeSut();
    const compareSpy = jest.spyOn(hashComparerStub, 'compare');

    await sut.auth(makeFakeAuthentication());
    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password');
  });

  it('Should throw if hashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut();
    jest.spyOn(hashComparerStub, 'compare').mockRejectedValueOnce(new Error());

    const promise = sut.auth(makeFakeAuthentication());
    await expect(promise).rejects.toThrow();
  });

  it('Should return null when LoadAccountByEmailRepository return false', async () => {
    const { sut, hashComparerStub } = makeSut();
    jest.spyOn(hashComparerStub, 'compare').mockResolvedValueOnce(false);

    const accessToken = await sut.auth(makeFakeAuthentication());
    expect(accessToken).toBeNull;
  });

  it('Should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut();
    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate');

    await sut.auth(makeFakeAuthentication());
    expect(generateSpy).toBeCalledWith('any_id');
  });

  it('Should throw if TokenGenerator  throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut();
    jest
      .spyOn(tokenGeneratorStub, 'generate')
      .mockRejectedValueOnce(new Error());

    const promise = sut.auth(makeFakeAuthentication());

    await expect(promise).rejects.toThrow();
  });
});
