import { Entity, Column, Index } from 'typeorm';
import { IsString, MaxLength, IsOptional, IsInt, Min } from 'class-validator';
import { BaseEntity } from '../shared/base/base.entity';
import { User } from '../users/users.entity';
import { Review } from 'src/recipes/reviews.entity';
import { Direction } from './directions.entity';
import { Ingredient } from './ingredients.entity';
import { Nutrition } from './nutrition.entity';

@Entity()
export class Recipe extends BaseEntity {
  @Column()
  @Index({ unique: true })
  @IsString()
  @MaxLength(255)
  title: string;

  @Column()
  @IsString()
  @IsOptional()
  description: string;

  @Column(type => Ingredient)
  ingredients: Ingredient[];

  @Column(type => Direction)
  directions: Direction[];

  @Column()
  @IsInt()
  @Min(1)
  preparationTime: number;

  @Column()
  @IsInt()
  @Min(1)
  cookingTime: number;

  @Column()
  @IsString()
  @IsOptional()
  notes: string;

  @Column(type => Nutrition)
  @IsOptional()
  nutrition: Nutrition;

  @Column(type => Review)
  reviews: Review[];

  @Column(type => User)
  createdBy: User;

  constructor(props: any) {
    super();
    Object.assign(this, props);
  }
}
