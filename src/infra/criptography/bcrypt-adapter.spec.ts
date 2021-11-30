import { BcryptAdapter } from './bcrypt-adapter';
import bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  async hash(
    _data: string | Buffer,
    _saltOrRounds: string | number
  ): Promise<string> {
    return 'hashed_value';
  },

  async compare(_data: string | Buffer, _encrypted: string): Promise<boolean> {
    return true;
  },
}));

const makeSut = () => {
  const salt = 12;
  const sut = new BcryptAdapter(salt);
  return { sut, salt };
};

describe('Bcrypt Adapter', () => {
  test('should call hash with correct value', async () => {
    const { sut, salt } = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hash');

    await sut.hash('any_value');

    expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
  });

  test('should return a valid hash on success', async () => {
    const { sut } = makeSut();
    const result = await sut.hash('any_value');

    expect(result).toBe('hashed_value');
  });

  test('should throw when bcrypt throws', async () => {
    const { sut } = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hash') as jest.Mock;
    hashSpy.mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error('')))
    );

    const result = sut.hash('any_value');

    await expect(result).rejects.toThrow();
  });

  test('should call compare with correct values', async () => {
    const { sut } = makeSut();
    const compareSpy = jest.spyOn(bcrypt, 'compare');

    await sut.compare('any_value', 'any_hash');

    expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash');
  });

  test('should return true if compare succeeds', async () => {
    const { sut } = makeSut();

    const result = await sut.compare('any_value', 'any_hash');

    expect(result).toBe(true);
  });

  test('should return false when compare fails', async () => {
    const { sut } = makeSut();

    const compareSpy = jest.spyOn(bcrypt, 'compare') as jest.Mock;
    compareSpy.mockReturnValueOnce(false);

    const result = await sut.compare('any_value', 'any_hash');

    expect(result).toBe(false);
  });

  test('should throw when compare throws', async () => {
    const { sut } = makeSut();

    const compareSpy = jest.spyOn(bcrypt, 'compare') as jest.Mock;
    compareSpy.mockRejectedValueOnce(new Error());

    const result = sut.compare('any_value', 'any_hash');

    await expect(result).rejects.toThrow();
  });
});
