import { Entity, Column } from 'typeorm';
import {
  IsString,
  MaxLength,
  IsOptional,
  IsInt,
  Min,
  IsNotEmpty,
} from 'class-validator';
import { BaseEntity } from '../shared/base/base.entity';
import { User } from '../users/users.entity';
import { Review } from 'src/recipes/reviews.entity';
import { Direction } from './directions.entity';
import { Ingredient } from './ingredients.entity';
import { Nutrition } from './nutrition.entity';

@Entity()
export class Recipe extends BaseEntity {
  @Column()
  @IsString({ message: 'Recipe slug must be a string' })
  slug: string;

  @Column()
  @IsNotEmpty({ message: 'Recipe title is required' })
  @IsString({ message: 'Recipe title must be a string' })
  @MaxLength(255, { message: 'Recipe title must be maximum 255 characters' })
  title: string;

  @Column()
  @IsOptional()
  description: string;

  @Column(type => Ingredient)
  @IsNotEmpty({ message: 'Recipe ingredients is required' })
  ingredients: Ingredient[];

  @Column(type => Direction)
  @IsNotEmpty({ message: 'Recipe directions is required' })
  directions: Direction[];

  @Column()
  @IsInt({ message: 'Recipe preparation time must be an integer' })
  @Min(1, { message: 'Recipe preparation time must be a pozitive integer' })
  preparationTime: number;

  @Column()
  @IsInt({ message: 'Recipe cooking time must be an integer' })
  @Min(1, { message: 'Recipe cooking time must be a pozitive integer' })
  cookingTime: number;

  @Column()
  @IsOptional()
  notes: string;

  @Column(type => Nutrition)
  @IsOptional()
  nutrition: Nutrition;

  @Column(type => Review)
  @IsOptional()
  reviews: Review[];

  @Column(type => User)
  @IsNotEmpty({ message: 'Recipe author is required' })
  createdBy: User;

  constructor(props: any) {
    super();
    Object.assign(this, props);
  }
}
