import { Module } from '@nestjs/common';
import { EncryptionService } from './encryption.service';
import { ConfigModule } from '../config/config.module';

/**
 * Module to encapsulate encryption logic.
 *
 * @export EncryptionService The service that handles the
 * encryption methods.
 * @class EncryptionModule
 */
@Module({
  imports: [ConfigModule],
  providers: [EncryptionService],
  exports: [EncryptionService],
})
export class EncryptionModule {}
