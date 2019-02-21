import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class LoginDto {
  @Expose()
  @IsEmail({}, { message: 'Incorrect email format' })
  @IsNotEmpty({ message: 'Email is required' })
  readonly email: string;

  @Expose()
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  readonly password: string;
}
