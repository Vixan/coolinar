import {
  Entity,
  Column,
  Index,
} from 'typeorm';
import { IsString, MaxLength, IsEmail } from 'class-validator';
import { BaseEntity } from '../shared/entities/base.entity';

@Entity()
export class User extends BaseEntity {
  @Column()
  @Index({ unique: true })
  @IsString()
  @MaxLength(255)
  name: string;

  @Column()
  @Index({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  password: string;

  constructor(props: any) {
    super();
    Object.assign(this, props);
  }
}
