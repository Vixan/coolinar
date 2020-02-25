import { ValidatorConstraint, ValidationArguments } from 'class-validator';
import { Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';

@ValidatorConstraint({ name: 'IsUserEmailUnavailable', async: true })
@Injectable()
export class IsUserEmailUnavailable {
  constructor(
    @Inject('UsersService') private readonly usersService: UsersService,
  ) {}

  async validate(email: string) {
    const user = await this.usersService.findOneByEmail(email);

    return !user;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Email already in use';
  }
}
