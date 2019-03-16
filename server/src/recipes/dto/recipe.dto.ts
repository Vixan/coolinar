import { Ingredient } from '../ingredients.entity';
import { Direction } from '../directions.entity';
import { Nutrition } from '../nutrition.entity';
import { Review } from '../../reviews/reviews.entity';
import { User } from '../../users/users.entity';
import {
  IsString,
  MaxLength,
  IsOptional,
  IsInt,
  Min,
  IsNotEmpty,
  IsArray,
} from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { Category } from '../category.entity';

@Exclude()
export class RecipeDto {
  @Expose()
  @IsString({ message: 'Recipe slug must be a string' })
  readonly slug: string;

  @Expose()
  @IsNotEmpty({ message: 'Recipe title is required' })
  @IsString({ message: 'Recipe title must be a string' })
  @MaxLength(255, { message: 'Recipe title must be maximum 255 characters' })
  readonly title: string;

  @Expose()
  @IsNotEmpty({ message: 'Recipe categories is required' })
  @IsArray({ message: 'Recipe categories must be an array' })
  readonly categories: Category[];

  @Expose()
  @IsOptional()
  readonly description: string;

  @IsNotEmpty({ message: 'Recipe ingredients is required' })
  @Expose()
  readonly ingredients: Ingredient[];

  @IsNotEmpty({ message: 'Recipe directions is required' })
  @Expose()
  readonly directions: Direction[];

  @Expose()
  @IsInt({ message: 'Recipe preparation time must be an integer' })
  @Min(1, { message: 'Recipe preparation time must be a pozitive integer' })
  readonly preparationTime: number;

  @Expose()
  @IsInt({ message: 'Recipe cooking time must be an integer' })
  @Min(1, { message: 'Recipe cooking time must be a pozitive integer' })
  readonly cookingTime: number;

  @Expose()
  @IsOptional()
  readonly notes: string;

  @Expose()
  @IsOptional()
  readonly nutrition: Nutrition;

  @Expose()
  @IsOptional()
  readonly reviews: Review[];

  @Expose()
  @IsNotEmpty({ message: 'Recipe author is required' })
  @IsString({ message: 'Recipe author username must be a string' })
  @MaxLength(255, {
    message: 'Recipe author username must be maximum 255 characters',
  })
  readonly author: string;
}
