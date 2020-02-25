import { ValidatorConstraint, ValidationArguments } from 'class-validator';
import { Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';

@ValidatorConstraint({ name: 'IsUserNameAvailable', async: true })
@Injectable()
export class IsUserNameAvailable {
  constructor(
    @Inject('UsersService') private readonly usersService: UsersService,
  ) {}

  async validate(name: string) {
    const user = await this.usersService.findOneByName(name);

    return !user;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Username already in use';
  }
}
