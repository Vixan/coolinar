import {
  Controller,
  Get,
  UseGuards,
  Param,
  UseInterceptors,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from './dto/user.dto';
import { TransformInterceptor } from './interceptors/transform.interceptor';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(new TransformInterceptor(UserDto))
  async findAll(): Promise<UserDto[]> {
    return this.usersService.findAll();
  }

  @Get(':name')
  @UseGuards(AuthGuard('jwt'))
  async findByName(@Param('name') name: string): Promise<User> {
    return this.usersService.findByName(name);
  }

  @Delete(':name')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Param('name') name: string): Promise<User> {
    const user = await this.usersService.findByName(name);

    if (!user) {
      throw new NotFoundException({ errors: { name: 'Username not found' } });
    }

    return this.usersService.delete(user);
  }
}
