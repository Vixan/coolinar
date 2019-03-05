import { Ingredient } from '../ingredients.entity';
import { Direction } from '../directions.entity';
import { Nutrition } from '../nutrition.entity';
import { Review } from '../reviews.entity';
import { User } from '../../users/users.entity';
import {
  IsString,
  MaxLength,
  IsOptional,
  IsInt,
  Min,
  IsNotEmpty,
} from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RecipeDto {
  @Expose()
  @IsNotEmpty({ message: 'Recipe title is required' })
  @IsString({ message: 'Recipe title must be a string' })
  @MaxLength(255, { message: 'Recipe title must be maximum 255 characters' })
  readonly title: string;

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
  readonly createdBy: User;
}
