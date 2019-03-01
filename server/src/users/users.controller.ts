import {
  Controller,
  Get,
  UseGuards,
  Param,
  UseInterceptors,
  Delete,
  NotFoundException,
  Put,
  Body,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from './dto/user.dto';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidationPipe } from '../shared/pipes/validation.pipe';

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

  @Put(':name')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async update(
    @Param('name') userName: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.usersService.findByName(userName);

    if (!user) {
      throw new NotFoundException({ errors: { name: 'Inexistent username' } });
    }

    return this.usersService.update({...user, ...updateUserDto});
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
