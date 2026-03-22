import { Injectable } from '@nestjs/common';

import { compare, hash } from 'bcrypt';

import { AuthPasswordHasherPort } from '../../application';

@Injectable()
export class BcryptPasswordHasher implements AuthPasswordHasherPort {
  async hash(raw: string): Promise<string> {
    return hash(raw, 10);
  }

  async compare(raw: string, encrypted: string): Promise<boolean> {
    return compare(raw, encrypted);
  }
}
