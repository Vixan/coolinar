import { Exclude, Expose } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Validate } from 'class-validator';
import { IsUserNameAvailable } from '../validation/user-name-available.constraint';
import { IsUserEmailUnavailable } from '../validation/user-email-unavailable.constraint';
import usersConstraints from 'src/users/users.constraints';

@Exclude()
export class SignUpUserDto {
  @Expose()
  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username is required' })
  @MinLength(usersConstraints.USERNAME_MIN_LENGTH, {
    message: `Username must longer than ${
      usersConstraints.USERNAME_MIN_LENGTH
    } characters`,
  })
  @MaxLength(usersConstraints.USERNAME_MAX_LENGTH, {
    message: `Username must be shorter than ${
      usersConstraints.USERNAME_MAX_LENGTH
    } characters long`,
  })
  @Validate(IsUserNameAvailable, { message: 'Username already in use' })
  readonly name: string;

  @Expose()
  @IsEmail({}, { message: 'Incorrect email format' })
  @Validate(IsUserEmailUnavailable, { message: 'Email already in use' })
  readonly email: string;

  @Expose()
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  readonly password: string;

  constructor(props: Partial<SignUpUserDto>) {
    Object.assign(this, props);
  }
}
