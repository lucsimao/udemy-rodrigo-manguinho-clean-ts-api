import { Hasher } from '../../data/protocols/criptography/hasher';
import bcrypt from 'bcrypt';

export class BcryptAdapter implements Hasher {
  constructor(private readonly salt: number) {}

  public async hash(value: string): Promise<string> {
    const result = await bcrypt.hash(value, this.salt);
    return result;
  }
}
