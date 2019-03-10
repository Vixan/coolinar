import { Column, BeforeInsert } from 'typeorm';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class Category {
  @Column()
  @IsNotEmpty({ message: 'Category name is required' })
  @IsString({ message: 'Category name must be a string' })
  name: string;

  @Column()
  @IsString({ message: 'Category slug is required' })
  @IsOptional()
  slug: string;
}
