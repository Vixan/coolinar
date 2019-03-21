import { Exclude, Expose } from 'class-transformer';
import { Nutrition } from '../nutrition.entity';
import {
  IsString,
  MaxLength,
  IsOptional,
  IsNotEmpty,
  IsInt,
  Min,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Ingredient } from '../ingredients.entity';
import { Direction } from '../directions.entity';
import { Category } from '../category.entity';

@Exclude()
export class UpdateRecipeDto {
  @Expose()
  @IsOptional()
  @IsNotEmpty({ message: 'Recipe title is required' })
  @IsString({ message: 'Recipe title must be a string' })
  @MaxLength(255, { message: 'Recipe title must be maximum 255 characters' })
  readonly title: string;

  @Expose()
  @IsOptional()
  @IsNotEmpty({ message: 'Recipe categories is required' })
  @IsArray({ message: 'Recipe categories must be an array' })
  @ValidateNested({ each: true })
  readonly categories: string[];

  @Expose()
  @IsOptional()
  @IsString({ message: 'Recipe description must be a string' })
  readonly description: string;

  @Expose()
  @IsOptional()
  @IsNotEmpty({ message: 'Recipe ingredients is required' })
  @IsArray({ message: 'Recipe ingredients must be an array' })
  @ValidateNested({ each: true })
  readonly ingredients: string[];

  @Expose()
  @IsOptional()
  @IsNotEmpty({ message: 'Recipe directions is required' })
  @IsArray({ message: 'Recipe ingredients must be an array' })
  @ValidateNested({ each: true })
  readonly directions: string[];

  @Expose()
  @IsOptional()
  @IsInt({ message: 'Recipe preparation time must be an integer' })
  @Min(1, { message: 'Recipe preparation time must be a positive integer' })
  readonly preparationTime: number;

  @Expose()
  @IsOptional()
  @IsInt({ message: 'Recipe cooking time must be an integer' })
  @Min(1, { message: 'Recipe cooking time must be a positive integer' })
  readonly cookingTime: number;

  @Expose()
  @IsOptional()
  @IsString({ message: 'Recipe notes must be a string' })
  readonly notes: string;

  @Expose()
  @IsOptional()
  @ValidateNested()
  readonly nutrition: Nutrition;
}
