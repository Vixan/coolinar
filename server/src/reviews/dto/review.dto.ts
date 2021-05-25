import { Exclude, Expose } from "class-transformer";
import { User } from "../../users/users.entity";
import { Recipe } from "../../recipes/recipes.entity";

@Exclude()
export class ReviewDto {
    @Expose()
    readonly text: string;

    @Expose()
    readonly score: number;

    @Expose()
    readonly author: User;

    @Expose()
    readonly recipe: Recipe;
}
