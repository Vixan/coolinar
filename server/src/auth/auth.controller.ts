import { Controller, Post, Response, Body, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post()
  async login(@Response() res: any, @Body() body: LoginDto): Promise<any> {
    if (!(body && body.email && body.password)) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: 'Email and password are required.' });
    }

    const user = await this.userService.findByEmail(body.email);

    if (!user) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: 'Email or password is incorrect.' });
    }

    const userToken = this.authService.createToken(user);

    return res.status(HttpStatus.OK).json(userToken);
  }
}
