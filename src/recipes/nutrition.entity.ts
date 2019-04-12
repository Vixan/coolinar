import { Column } from 'typeorm';
import { IsInt, Min, IsOptional, IsNumber } from 'class-validator';

/**
 * Recipe nutrition database model.
 *
 * @class Nutrition
 */
export class Nutrition {
  @Column()
  @IsOptional()
  @Min(0, { message: 'Recipe calories value must be pozitive or 0' })
  calories: number;

  @Column()
  @IsOptional()
  @Min(0, { message: 'Recipe fat value must be pozitive or 0' })
  fat: number;

  @Column()
  @IsOptional()
  @Min(0, { message: 'Recipe carbohydrates value must be pozitive or 0' })
  carbohydrates: number;

  @Column()
  @IsOptional()
  @Min(0, { message: 'Recipe protein value must be pozitive or 0' })
  protein: number;

  @Column()
  @IsOptional()
  @Min(0, { message: 'Recipe fibre value must be pozitive or 0' })
  fibre: number;

  @Column()
  @IsOptional()
  @Min(0, { message: 'Recipe sodium value must be pozitive or 0' })
  sodium: number;
}
