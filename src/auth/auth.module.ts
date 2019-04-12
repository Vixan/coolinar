import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt/jwt.strategy';
import { UsersService } from '../users/users.service';
import { ConfigModule } from '../config/config.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '../config/config.service';
import { JwtConfigService } from './jwt/jwt-config.service';
import { EncryptionModule } from '../encryption/encryption.module';
import { SlugProvider } from 'src/shared/providers/slug.provider';

/**
 * Module that encapsulates authentication logic.
 *
 * @class AuthModule
 */
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useClass: JwtConfigService,
      inject: [ConfigService],
    }),
    UsersModule,
    ConfigModule,
    EncryptionModule,
  ],
  providers: [AuthService, JwtStrategy, UsersService, SlugProvider],
  controllers: [AuthController],
})
export class AuthModule {}
