import { Encrypter } from '../../data/protocols/encrypter';
import bcrypt from 'bcrypt';

export class BcryptAdapter implements Encrypter {
  constructor(private readonly salt: number) {}

  public async encrypt(value: string): Promise<string> {
    const result = await bcrypt.hash(value, this.salt);
    return result;
  }
}
