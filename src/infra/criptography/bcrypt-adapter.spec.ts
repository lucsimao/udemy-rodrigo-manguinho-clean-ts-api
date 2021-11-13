import { BcryptAdapter } from './bcrypt-adapter';
import bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  async hash() {
    return Promise.resolve('hashed_value');
  },
}));

const makeSut = () => {
  const salt = 12;
  const sut = new BcryptAdapter(salt);
  return { sut, salt };
};

describe('Bcrypt Adapter', () => {
  test('should call bcrypt with correct value', async () => {
    const { sut, salt } = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hash');

    await sut.encrypt('any_value');

    expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
  });

  test('should return a hash on success', async () => {
    const { sut } = makeSut();
    const result = await sut.encrypt('any_value');

    expect(result).toBe('hashed_value');
  });

  test('should throw when bcrypt throws', async () => {
    const { sut } = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hash') as jest.Mock;
    hashSpy.mockRejectedValueOnce(new Error(''));

    const result = sut.encrypt('any_value');

    expect(result).rejects.toThrow();
  });
});
