import {
    Column,
    ManyToOne,
    Entity,
    OneToMany,
    BeforeInsert,
    BeforeUpdate,
    BeforeRemove
} from "typeorm";
import {
    IsString,
    Min,
    IsInt,
    Max,
    IsOptional,
    IsNotEmpty
} from "class-validator";
import { User } from "../users/users.entity";
import { BaseEntity } from "../shared/base/base.entity";
import { Recipe } from "../recipes/recipes.entity";

/**
 * Recipe review database model.
 *
 * @export
 * @class Review
 */
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
