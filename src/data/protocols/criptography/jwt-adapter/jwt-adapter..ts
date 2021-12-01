import { Encrypter } from '../bcrypt-adapter/token-generator';
import jwt from 'jsonwebtoken';

export class JwtAdapter implements Encrypter {
  constructor(private readonly secret: string) {}

  async encrypt(value: string): Promise<string> {
    const result = await jwt.sign({ id: value }, this.secret);
    return result;
  }
}
