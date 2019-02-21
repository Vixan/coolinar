import {
  Controller,
  Get,
  UseGuards,
  Param,
  Post,
  Body,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from './dto/user.dto';
import { ValidationPipe } from '../shared/pipes/validation.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':name')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('name') name: string): Promise<User> {
    return this.usersService.findByName(name);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async add(@Body() userDto: UserDto): Promise<User> {
    return this.usersService.add(userDto);
  }
}
