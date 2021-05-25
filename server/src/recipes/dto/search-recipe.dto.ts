import { Exclude, Expose } from "class-transformer";
import { IsOptional } from "class-validator";

@Exclude()
export class SearchRecipeDto {
    @Expose()
    @IsOptional()
    title: string;

    @Expose()
    @IsOptional()
    author: string;

    @Expose()
    @IsOptional()
    ingredients: string[];

    @Expose()
    @IsOptional()
    categories: string[];
}
