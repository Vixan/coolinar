import { Inject, Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint } from 'class-validator';
import { UsersService } from 'src/users/users.service';

@ValidatorConstraint({ name: 'IsUserEmailAvailable', async: true })
@Injectable()
export class IsUserEmailAvailable {
  constructor(
    @Inject(UsersService) private readonly usersService: UsersService,
  ) {}

  async validate(email: string) {
    const user = await this.usersService.findOneByEmail(email);

    return !!user;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Email not found';
  }
}
