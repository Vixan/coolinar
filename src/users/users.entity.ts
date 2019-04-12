import { Entity, Column } from 'typeorm';
import {
  IsString,
  MaxLength,
  IsEmail,
  IsOptional,
  IsUrl,
} from 'class-validator';
import { BaseEntity } from '../shared/base/base.entity';

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

  @Column()
  @IsOptional()
  favoriteRecipes: string[];

  constructor(props: any) {
    super();
    Object.assign(this, props);
  }
}
