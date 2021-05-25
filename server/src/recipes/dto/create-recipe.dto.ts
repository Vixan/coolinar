import { Exclude, Expose } from "class-transformer";
import { Nutrition } from "../nutrition.entity";
import {
    IsString,
    MaxLength,
    IsOptional,
    IsNotEmpty,
    IsInt,
    Min,
    ValidateNested,
    IsArray,
    ArrayNotEmpty
} from "class-validator";

@Exclude()
export class CreateRecipeDto {
    @Expose()
    @IsNotEmpty({ message: "Recipe title is required" })
    @IsString({ message: "Recipe title must be a string" })
    @MaxLength(255, { message: "Recipe title must be maximum 255 characters" })
    readonly title: string;

    @Expose()
    @IsOptional()
    @IsString({ message: "Recipe description must be a string" })
    readonly description: string;

    @Expose()
    @IsNotEmpty({ message: "Recipe categories is required" })
    @IsArray({ message: "Recipe categories must be an array" })
    @ArrayNotEmpty({ message: "Recipe categories cannot be empty" })
    readonly categories: string[];

    @Expose()
    @IsNotEmpty({ message: "Recipe ingredients is required" })
    @IsArray({ message: "Recipe ingredients must be an array" })
    @ArrayNotEmpty({ message: "Recipe ingredients cannot be empty" })
    readonly ingredients: string[];

    @Expose()
    @IsNotEmpty({ message: "Recipe directions is required" })
    @IsArray({ message: "Recipe ingredients must be an array" })
    @ArrayNotEmpty({ message: "Recipe directions cannot be empty" })
    readonly directions: string[];

    @Expose()
    @IsInt({ message: "Recipe preparation time must be an integer" })
    @Min(1, { message: "Recipe preparation time must be a positive integer" })
    readonly preparationTime: number;

    @Expose()
    @IsInt({ message: "Recipe cooking time must be an integer" })
    @Min(0, { message: "Recipe cooking time must be a positive integer" })
    readonly cookingTime: number;

    @Expose()
    @IsOptional()
    @IsString({ message: "Recipe notes must be a string" })
    readonly notes: string;

    @Expose()
    @IsOptional()
    @ValidateNested()
    readonly nutrition: Nutrition;

    @Expose()
    @IsOptional()
    readonly imageUrls: string[];

    @Expose()
    @IsOptional()
    readonly servings: number;

    @Expose()
    @IsNotEmpty({ message: "Recipe author username is required" })
    @IsString({ message: "Recipe author username must be a string" })
    @MaxLength(255, {
        message: "Recipe author username must be maximum 255 characters"
    })
    readonly author: string;
}
