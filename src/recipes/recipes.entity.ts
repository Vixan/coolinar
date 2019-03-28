import { Entity, Column } from 'typeorm';
import {
  IsString,
  MaxLength,
  IsOptional,
  IsInt,
  Min,
  IsNotEmpty,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';
import { BaseEntity } from '../shared/base/base.entity';
import { Review } from 'src/reviews/reviews.entity';
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
  @IsString({ message: 'Recipe description must be a string' })
  description: string;

  @Column()
  @IsArray({ message: 'Recipe categories must be an array' })
  @ArrayNotEmpty({ message: 'Recipe categories cannot be empty' })
  categories: string[];

  @Column()
  @IsArray({ message: 'Recipe ingredients must be an array' })
  @ArrayNotEmpty({ message: 'Recipe ingredients cannot be empty' })
  ingredients: string[];

  @Column()
  @IsArray({ message: 'Recipe directions must be an array' })
  @ArrayNotEmpty({ message: 'Recipe directions cannot be empty' })
  directions: string[];

  @Column()
  @IsInt({ message: 'Recipe preparation time must be an integer' })
  @Min(1, { message: 'Recipe preparation time must be a positive integer' })
  preparationTime: number;

  @Column()
  @IsInt({ message: 'Recipe cooking time must be an integer' })
  @Min(0, { message: 'Recipe cooking time must be a positive integer' })
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

  @Column()
  averageReviewScore: number;

  @Column()
  @IsNotEmpty({ message: 'Recipe author is required' })
  @IsString({ message: 'Recipe author must be a string' })
  author: string;

  constructor(props: any) {
    super();
    Object.assign(this, props);
  }
}
