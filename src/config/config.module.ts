import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';

/**
 * Module that encapsulates the Configuration logic.
 *
 * @export {ConfigService} The configuration service.
 * @class ConfigModule
 */
@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService(`.env.${process.env.NODE_ENV}`),
    },
  ],
  exports: [ConfigService],
})
export class ConfigModule {}
