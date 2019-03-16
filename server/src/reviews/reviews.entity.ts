import { Column, Entity } from 'typeorm';
import { IsString, Min, IsInt, Max, IsOptional, IsNotEmpty } from 'class-validator';
import { User } from '../users/users.entity';

export class Review {
  @Column()
  @IsString({ message: 'Review text must be a string' })
  @IsOptional()
  text: string;

  @Column()
  @IsNotEmpty({ message: 'Review author is required' })
  @IsString({ message: 'Review author name must be a string' })
  author: string;

  @Column()
  @IsInt({ message: 'Review score must be an integer' })
  @Min(1, { message: 'Review minimum score is 1' })
  @Max(5, { message: 'Review maximum score is 5' })
  score: number;
}
