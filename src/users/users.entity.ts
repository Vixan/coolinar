import { Entity, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import {
  IsString,
  MaxLength,
  IsEmail,
  IsOptional,
  IsUrl,
} from 'class-validator';
import { BaseEntity } from '../shared/base/base.entity';
import { Review } from '../reviews/reviews.entity';
import { Recipe } from '../recipes/recipes.entity';

/**
 * User database entity.
 *
 * @class User
 * @extends {BaseEntity}
 */
@Entity()
export class User extends BaseEntity {
  @Column()
  @IsString()
  @MaxLength(255)
  name: string;

  @Column()
  @IsString()
  slug: string;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  password: string;

  @Column()
  @IsOptional()
  @IsUrl()
  avatarUrl: string;

  @ManyToMany(type => Recipe)
  @JoinTable()
  @IsOptional()
  favoriteRecipes: Recipe[];

  @OneToMany(type => Recipe, recipe => recipe.author)
  createdRecipes: Recipe[];

  @OneToMany(type => Review, review => review.author)
  reviews: Review[];

  constructor(props: any) {
    super();
    Object.assign(this, props);
  }
}
