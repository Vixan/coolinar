import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiConfigService } from '../config/api-config.service';
import { User } from '../users/users.entity';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './strategies/jwt/jwt-payload.interface';
import { SignInUserDto, ApiTokenDto, SignUpUserDto } from './dtos';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly apiConfigService: ApiConfigService,
  ) {}

  async validateUser(userCredentials: SignInUserDto): Promise<User> {
    const user = await this.usersService.findOneByEmail(userCredentials.email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await user.comparePassword(
      userCredentials.password,
    );
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  private createToken(payload: JwtPayload): ApiTokenDto {
    const expiresIn = this.apiConfigService.jwtExpiration;
    const token = this.jwtService.sign(payload, {
      expiresIn,
    });

    return {
      token,
      expiresIn,
    };
  }

  async signIn(user: SignInUserDto): Promise<ApiTokenDto> {
    return this.createToken({ email: user.email });
  }

  async signUp(userSignUpDto: SignUpUserDto): Promise<ApiTokenDto> {
    const user = new User({ ...userSignUpDto });
    await this.usersService.create(user);

    return this.createToken({ email: userSignUpDto.email });
  }
}
