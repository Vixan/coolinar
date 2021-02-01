import { IsString, MaxLength } from "class-validator";
import { Column, Entity, ManyToOne } from "typeorm";
import { Recipe } from "../recipes/recipes.entity";
import { BaseEntity } from "../shared/base/base.entity";

/**
 * Recipe Direction database model.
 *
 * @class Direction
 */
@Entity()
export class Direction extends BaseEntity {
    @Column({ unique: true })
    @IsString()
    @MaxLength(255)
    name: string;

    @ManyToOne(type => Recipe, recipe => recipe.directions, {
        onDelete: "CASCADE"
    })
    recipe: Recipe;

    constructor(props: any) {
        super();
        Object.assign(this, props);
    }
}
