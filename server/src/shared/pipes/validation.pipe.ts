import {
    Injectable,
    PipeTransform,
    ArgumentMetadata,
    BadRequestException
} from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { ErrorUtils } from "../utils/error.utils";

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    async transform(value: any, { metatype }: ArgumentMetadata) {
        if (!this.isValidType(metatype)) {
            return value;
        }

        const object = plainToClass(metatype, value);
        const errors = await validate(object);

        if (errors.length > 0) {
            throw new BadRequestException({
                errors: ErrorUtils.createErrors(errors)
            });
        }

        return value;
    }

    private isValidType(metatype: any) {
        return metatype && this.isPrimitiveType(metatype);
    }

    private isPrimitiveType(metatype: any): boolean {
        const types = [String, Boolean, Number, Array, Object];

        return !types.find(type => metatype === type);
    }
}
