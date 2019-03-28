import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '../config/config.service';

@Injectable()
export class EncryptionService {
  private saltRounds: number = 10;

  constructor(private readonly configService: ConfigService) {
    this.saltRounds = this.configService.hashSaltRounds;
  }

  async getHash(text: string): Promise<string> {
    return bcrypt.hash(text, this.saltRounds);
  }

  async matchesHash(text: string, hashCandidate: string): Promise<boolean> {
    return bcrypt.compare(text, hashCandidate);
  }
}
