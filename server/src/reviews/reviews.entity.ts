import {
    IsInt,


    IsNotEmpty, IsOptional, IsString,


    Max, Min
} from "class-validator";
import {
    Column,

    Entity, ManyToOne
} from "typeorm";
import { Recipe } from "../recipes/recipes.entity";
import { BaseEntity } from "../shared/base/base.entity";
import { User } from "../users/users.entity";

@Entity()
export class Review extends BaseEntity {
    @Column()
    @IsString({ message: "Review text must be a string" })
    @IsOptional()
    text: string;

    @IsNotEmpty({ message: "Review author is required" })
    @ManyToOne(type => User, user => user.reviews)
    author: User;

    @ManyToOne(type => Recipe, recipe => recipe.reviews, {
        onDelete: "CASCADE"
    })
    recipe: Recipe;

    @Column()
    @IsInt({ message: "Review score must be an integer" })
    @Min(1, { message: "Review minimum score is 1" })
    @Max(5, { message: "Review maximum score is 5" })
    score: number;

    constructor(props: any) {
        super();
        Object.assign(this, props);
    }
}
