import { HashComparer } from '../../data/protocols/criptography/bcrypt-adapter/hash-comparer';
import { Hasher } from '../../data/protocols/criptography/bcrypt-adapter/hasher';
import bcrypt from 'bcrypt';

export class BcryptAdapter implements Hasher, HashComparer {
  constructor(private readonly salt: number) {}

  public async hash(value: string): Promise<string> {
    const result = await bcrypt.hash(value, this.salt);
    return result;
  }

  public async compare(value: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(value, hash);
  }
}
