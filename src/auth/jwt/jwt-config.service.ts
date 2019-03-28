import { JwtOptionsFactory, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from '../../config/config.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

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
