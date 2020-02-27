import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint } from "class-validator";
import { app } from "src/main";
import { UsersService } from "../../users/users.service";

@ValidatorConstraint({ name: "IsUserNameAvailable", async: true })
@Injectable()
export class IsUserNameAvailable {
    async validate(name: string) {
        const usersService = app.get(UsersService);
        const user = await usersService.findOneByName(name);

        return !user;
    }

    defaultMessage(args: ValidationArguments) {
        return "Username already in use";
    }
}
