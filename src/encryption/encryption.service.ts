import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '../config/config.service';

/**
 * Injectable service with that exposes encryption methods.
 *
 * @export
 * @class EncryptionService
 */
@Injectable()
export class EncryptionService {
  private saltRounds: number = 10;

  constructor(private readonly configService: ConfigService) {
    this.saltRounds = this.configService.hashSaltRounds;
  }

  /**
   * Generates the hash from the input text.
   *
   * @param {string} text Text to be hashed.
   * @returns {Promise<string>} Promise of the hashed text.
   * @memberof EncryptionService
   */
  async getHash(text: string): Promise<string> {
    return bcrypt.hash(text, this.saltRounds);
  }

  /**
   * Verify if the passed hash matches the text to be hashed.
   *
   * @param {string} text Text to be hashed.
   * @param {string} hashCandidate Hash to be compared against.
   * @returns {Promise<boolean>} Promise of the comparison result.
   * @memberof EncryptionService
   */
  async matchesHash(text: string, hashCandidate: string): Promise<boolean> {
    return bcrypt.compare(text, hashCandidate);
  }
}
