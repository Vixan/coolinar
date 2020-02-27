import { Column, Entity } from "typeorm";
import { IsInt, Min, IsOptional, IsNumber } from "class-validator";
import { BaseEntity } from "../shared/base/base.entity";

/**
 * Recipe nutrition database model.
 *
 * @class Nutrition
 */
export class Nutrition extends BaseEntity {
    @IsOptional()
    @Min(0, { message: "Recipe calories value must be pozitive or 0" })
    calories: number;

    @IsOptional()
    @Min(0, { message: "Recipe fat value must be pozitive or 0" })
    fat: number;

    @IsOptional()
    @Min(0, { message: "Recipe carbohydrates value must be pozitive or 0" })
    carbohydrates: number;

    @IsOptional()
    @Min(0, { message: "Recipe protein value must be pozitive or 0" })
    protein: number;

    @IsOptional()
    @Min(0, { message: "Recipe fibre value must be pozitive or 0" })
    fibre: number;

    @IsOptional()
    @Min(0, { message: "Recipe sodium value must be pozitive or 0" })
    sodium: number;

    constructor(props: any) {
        super();
        Object.assign(this, props);
    }
}
