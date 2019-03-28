import { Injectable } from '@nestjs/common';
import { JwtPayload } from './jwt/jwt-payload.interface';
import { User } from 'src/users/users.entity';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '../config/config.service';
import { JwtResponseDto } from './jwt/jwt-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  createToken(user: User) {
    const jwtPayload: JwtPayload = { email: user.email };
    const expiresIn = this.configService.jwtExpiration;
    const accessToken = this.jwtService.sign(jwtPayload, { expiresIn });
    const jwtResponseDto: JwtResponseDto = {
      expiresIn,
      accessToken,
    };

    return jwtResponseDto;
  }

  async validateUser(payload: JwtPayload): Promise<User | null> {
    return await this.usersService.findByEmail(payload.email);
  }
}
