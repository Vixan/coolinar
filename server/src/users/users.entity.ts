import {
  Entity,
  Column,
} from 'typeorm';
import { IsString, MaxLength, IsEmail, IsOptional } from 'class-validator';
import { BaseEntity } from '../shared/base/base.entity';

@Entity()
export class User extends BaseEntity {
  @Column()
  @IsString()
  @MaxLength(255)
  name: string;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  password: string;

  @Column()
  @IsOptional()
  favoriteRecipes: string[];

  constructor(props: any) {
    super();
    Object.assign(this, props);
  }
}
