import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersService } from 'src/users/users.service';
import { app } from '../../main';

@ValidatorConstraint({ name: 'IsUserEmailAvailable', async: true })
@Injectable()
export class IsUserEmailAvailable implements ValidatorConstraintInterface {
  async validate(email: string) {
    const usersService = app.get(UsersService);
    const user = await usersService.findOneByEmail(email);

    return !!user;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Email not found';
  }
}
