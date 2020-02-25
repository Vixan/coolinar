import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiConfigService {
  constructor(private readonly configService: ConfigService) {}

  get port(): number {
    return this.configService.get<number>('API_PORT');
  }

  get globalPrefix(): string {
    return this.configService.get('API_GLOBAL_PREFIX');
  }

  get jwtSecret(): string {
    return this.configService.get('JWT_SECRET');
  }

  get jwtExpiration(): number | string {
    return this.configService.get('JWT_EXPIRATION');
  }
}
