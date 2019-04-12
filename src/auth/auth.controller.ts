import {
  Controller,
  Post,
  Body,
  UsePipes,
  HttpCode,
  HttpStatus,
  UseFilters,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user';
import { UsersService } from '../users/users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { ValidationPipe } from '../shared/pipes/validation.pipe';
import { ConflictException } from '@nestjs/common';
import { EncryptionService } from '../encryption/encryption.service';
import { User } from '../users/users.entity';
import { HttpExceptionFilter } from 'src/shared/filters/http-exception.filter';
import { JwtResponseDto } from './jwt/jwt-response.dto';

/**
 * Controller that handles the authentication routes.
 *
 * @class AuthController
 */
@Controller('auth')
@UseFilters(HttpExceptionFilter)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly encryptionService: EncryptionService,
  ) {}

  /**
   * Authenticate the existing user. On authentication failure send
   * HTTP status 401 (Unauthorized) and a message specifying the cause.
   *
   * @param {LoginUserDto} loginUserDto User login credentials.
   * @returns {Promise<JwtResponseDto>} Generated JWT response.
   * @memberof AuthController
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  async login(@Body() loginUserDto: LoginUserDto): Promise<JwtResponseDto> {
    const user = await this.userService.findByEmail(loginUserDto.email);

    if (!user) {
      throw new UnauthorizedException({
        errors: { email: 'Inexistent email' },
      });
    }

    const isPasswordCorrect = await this.encryptionService.matchesHash(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new UnauthorizedException({
        errors: { password: 'Incorrect password' },
      });
    }

    return this.authService.createToken(user);
  }

  /**
   * Register a new user and authenticate it.
   *
   * @param {RegisterUserDto} registerUserDto User registration credentials.
   * @returns {Promise<JwtResponseDto>} Generated JWT response.
   * @memberof AuthController
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  async register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<JwtResponseDto> {
    const userfoundByEmail = await this.userService.findByEmail(
      registerUserDto.email,
    );

    if (userfoundByEmail) {
      throw new ConflictException({
        errors: { email: 'Email already in use' },
      });
    }

    const userfoundByName = await this.userService.findByName(
      registerUserDto.name,
    );

    if (userfoundByName) {
      throw new ConflictException({
        errors: { name: 'Username already in use' },
      });
    }

    const user = new User({ ...registerUserDto });
    const createdUser = await this.userService.create(user);

    return this.authService.createToken(createdUser);
  }
}
