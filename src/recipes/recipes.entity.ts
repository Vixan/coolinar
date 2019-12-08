import {
  Entity,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import {
  IsString,
  MaxLength,
  IsOptional,
  IsInt,
  Min,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { BaseEntity } from '../shared/base/base.entity';
import { Review } from 'src/reviews/reviews.entity';
import { Nutrition } from './nutrition.entity';
import { User } from '../users/users.entity';
import { Category } from '../categories/categories.entity';
import { Ingredient } from '../ingredients/ingredients.entity';
import { Direction } from '../directions/directions.entity';

/**
 * Recipe database entity.
 *
 * @export
 * @class Recipe
 * @extends {BaseEntity}
 */
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
  @IsString({ message: 'Recipe description must be a string' })
  description: string;

  @ManyToMany(type => Category, { onDelete: 'CASCADE' })
  @JoinTable()
  categories: Category[];

  @OneToMany(type => Ingredient, ingredient => ingredient.recipe, { onDelete: 'CASCADE' })
  ingredients: Ingredient[];

  @OneToMany(type => Direction, direction => direction.recipe, { onDelete: 'CASCADE' })
  directions: Direction[];

  @Column()
  @IsInt({ message: 'Recipe preparation time must be an integer' })
  @Min(1, { message: 'Recipe preparation time must be a positive integer' })
  preparationTime: number;

  @Column()
  @IsInt({ message: 'Recipe cooking time must be an integer' })
  @Min(0, { message: 'Recipe cooking time must be a positive integer' })
  cookingTime: number;

  @Column({ nullable: true })
  @IsOptional()
  notes: string;

  @Column({ type: 'jsonb', nullable: false })
  @IsOptional()
  nutrition: Nutrition;

  @OneToMany(type => Review, review => review.recipe, { onDelete: 'CASCADE' })
  reviews: Review[];

  @Column()
  averageReviewScore: number;

  @Column({ type: String, array: true })
  imageUrls: string[];

  @Column()
  @IsOptional()
  @IsNumber({}, { message: 'Recipe servings count must be a number' })
  servings: number;

  @ManyToOne(type => User, user => user.createdRecipes)
  author: User;

  constructor(props: any) {
    super();
    Object.assign(this, props);
  }
}
