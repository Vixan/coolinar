import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint } from 'class-validator';
import { app } from 'src/main';
import { UsersService } from 'src/users/users.service';

@ValidatorConstraint({ name: 'IsUserEmailUnavailable', async: true })
@Injectable()
export class IsUserEmailUnavailable {
  async validate(email: string) {
    const usersService = app.get(UsersService);
    const user = await usersService.findOneByEmail(email);

    return !user;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Email already in use';
  }
}
