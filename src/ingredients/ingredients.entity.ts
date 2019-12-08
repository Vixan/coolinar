import { BaseEntity } from '../shared/base/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { IsString, MaxLength } from 'class-validator';
import { Recipe } from '../recipes/recipes.entity';

/**
 * Recipe ingredient database model.
 *
 * @class Ingredient
 */
@Entity()
export class Ingredient extends BaseEntity {
  @Column({ unique: true })
  @IsString()
  @MaxLength(255)
  name: string;

  @ManyToOne(type => Recipe, recipe => recipe.ingredients)
  recipe: Recipe;

  constructor(props: any) {
    super();
    Object.assign(this, props);
  }
}
