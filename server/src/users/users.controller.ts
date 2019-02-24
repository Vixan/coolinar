import {
  Controller,
  Get,
  UseGuards,
  Param,
  UseInterceptors,
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
  async findOne(@Param('name') name: string): Promise<User> {
    return this.usersService.findByName(name);
  }
}
