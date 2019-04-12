import { JwtOptionsFactory, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from '../../config/config.service';
import { Injectable } from '@nestjs/common';

/**
 * Factory service for creating JWT configuration options.
 *
 * @export
 * @class JwtConfigService
 * @implements {JwtOptionsFactory}
 */
@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Creates a JWT options object, which includes the secret or private key
   * and token expiration time.
   *
   * @returns {(JwtModuleOptions | Promise<JwtModuleOptions>)}
   * @memberof JwtConfigService
   */
  createJwtOptions(): JwtModuleOptions | Promise<JwtModuleOptions> {
    const secretOrPrivateKey = this.configService.jwtSecret;
    const expiresIn = this.configService.jwtExpiration;

    const jwtOptions: JwtModuleOptions = {
      secretOrPrivateKey,
      signOptions: {
        expiresIn,
      },
    };

    return jwtOptions;
  }
}
