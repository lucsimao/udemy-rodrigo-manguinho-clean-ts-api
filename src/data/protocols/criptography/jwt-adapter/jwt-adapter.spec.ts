import { JwtAdapter } from './jwt-adapter.';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken', () => ({
  async sign(): Promise<string> {
    return 'any_token';
  },
}));

const makeSut = () => {
  const sut = new JwtAdapter('secret');
  return { sut };
};

describe('Jwt Adapter', () => {
  test('should call sign with correct values', async () => {
    const { sut } = makeSut();
    const signSpy = jest.spyOn(jwt, 'sign');

    await sut.encrypt('any_id');

    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret');
  });

  test('should return a token on sign success', async () => {
    const { sut } = makeSut();

    const accessToken = await sut.encrypt('any_id');

    expect(accessToken).toBe('any_token');
  });

  test('should throw if sign throws', async () => {
    const { sut } = makeSut();
    const signSpy = jest.spyOn(jwt, 'sign') as jest.Mock;
    signSpy.mockRejectedValueOnce(new Error());

    const promise = sut.encrypt('any_id');

    await expect(promise).rejects.toThrow();
  });
});
