import { Column, Entity } from 'typeorm';
import { IsString, Min, IsInt, Max, IsOptional } from 'class-validator';
import { User } from '../users/users.entity';

export class Review {
  @Column()
  @IsString()
  @IsOptional()
  text: string;

  @Column(type => User)
  createdBy: User;

  @Column()
  @IsInt()
  @Min(1)
  @Max(5)
  score: number;
}
