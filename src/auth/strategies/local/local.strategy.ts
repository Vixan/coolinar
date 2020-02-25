import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { validate } from 'class-validator';
import { Strategy } from 'passport-local';
import { AuthService } from '../../auth.service';
import { SignInUserDto } from '../../dtos/sign-in-user.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const userCredentials = new SignInUserDto({
      email,
      password,
    });

    const validationErrors = await validate(userCredentials);
    if (validationErrors.length) {
      throw new BadRequestException(validationErrors);
    }

    const user = await this.authService.validateUser(userCredentials);
    if (!user) {
      throw new UnauthorizedException({
        message: 'Incorrect email or password',
      });
    }

    return user;
  }
}
