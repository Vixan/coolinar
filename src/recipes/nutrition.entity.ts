import { Column } from 'typeorm';
import { IsInt, Min, IsOptional } from 'class-validator';

export class Nutrition {
  @Column()
  @IsOptional()
  @IsInt({ message: 'Recipe calories value must be an integer' })
  @Min(0, { message: 'Recipe calories value must be pozitive or 0' })
  calories: number;

  @Column()
  @IsOptional()
  @IsInt({ message: 'Recipe fat value must be an integer' })
  @Min(0, { message: 'Recipe fat value must be pozitive or 0' })
  fat: number;

  @Column()
  @IsOptional()
  @IsInt({ message: 'Recipe carbohydrates value must be an integer' })
  @Min(0, { message: 'Recipe carbohydrates value must be pozitive or 0' })
  carbohydrates: number;

  @Column()
  @IsOptional()
  @IsInt({ message: 'Recipe protein value must be an integer' })
  @Min(0, { message: 'Recipe protein value must be pozitive or 0' })
  protein: number;

  @Column()
  @IsOptional()
  @IsInt({ message: 'Recipe fibre value must be an integer' })
  @Min(0, { message: 'Recipe fibre value must be pozitive or 0' })
  fibre: number;

  @Column()
  @IsOptional()
  @IsInt({ message: 'Recipe sodium value must be an integer' })
  @Min(0, { message: 'Recipe sodium value must be pozitive or 0' })
  sodium: number;
}
