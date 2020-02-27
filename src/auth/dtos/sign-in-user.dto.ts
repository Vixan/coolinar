import { Exclude, Expose } from "class-transformer";
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Validate,
    MinLength
} from "class-validator";
import { IsUserEmailAvailable } from "../validation/user-email-available.constraint";
import { MaxLength } from "class-validator";
import usersConstraints from "src/users/users.constraints";

@Exclude()
export class SignInUserDto {
    @Expose()
    @IsEmail({}, { message: "Email is not valid" })
    @Validate(IsUserEmailAvailable, { message: "Email not found" })
    readonly email: string;

    @Expose()
    @IsString({ message: "Password must be a string" })
    @IsNotEmpty({ message: "Password is required" })
    @MinLength(usersConstraints.PASSWORD_MIN_LENGTH, {
        message: `Password must be longer than ${
            usersConstraints.PASSWORD_MIN_LENGTH
        } characters`
    })
    @MaxLength(usersConstraints.PASSWORD_MAX_LENGTH, {
        message: `Password must be shorter than ${
            usersConstraints.PASSWORD_MAX_LENGTH
        } characters`
    })
    readonly password: string;

    constructor(props: Partial<SignInUserDto>) {
        Object.assign(this, props);
    }
}
