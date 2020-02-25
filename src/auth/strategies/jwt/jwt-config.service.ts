import { JwtOptionsFactory, JwtModuleOptions } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { ApiConfigService } from 'src/config/api-config.service';

/**
 * Factory service for creating JWT configuration options.
 *
 * @export
 * @class JwtConfigService
 * @implements {JwtOptionsFactory}
 */
@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  constructor(private readonly configService: ApiConfigService) {}

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

    return {
      secretOrPrivateKey,
      signOptions: {
        expiresIn,
      },
    };
  }
}
