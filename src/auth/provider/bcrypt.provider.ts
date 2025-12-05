import { Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptProvider extends HashingProvider {
  public async hashPassword(password: string | Buffer): Promise<string> {
    // generate a salt
    let salt = await bcrypt.genSalt();
    // hash the password
    return await bcrypt.hash(password, salt);
  }

  public async comparePassword(
    plainPassword: string | Buffer,
    hashedPassword: string | Buffer,
  ): Promise<boolean> {
    // compare the password
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
