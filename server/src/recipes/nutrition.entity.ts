import { Column } from 'typeorm';
import { IsInt, Min, IsOptional } from 'class-validator';

export class Nutrition {
  @Column()
  @IsOptional()
  @IsInt()
  @Min(0)
  calories: number;

  @Column()
  @IsOptional()
  @IsInt()
  @Min(0)
  fat: number;

  @Column()
  @IsOptional()
  @IsInt()
  @Min(0)
  carbohydrates: number;

  @Column()
  @IsOptional()
  @IsInt()
  @Min(0)
  sugar: number;

  @Column()
  @IsOptional()
  @IsInt()
  @Min(0)
  salt: number;

  @Column()
  @IsOptional()
  @IsInt()
  @Min(0)
  protein: number;

  @Column()
  @IsOptional()
  @IsInt()
  @Min(0)
  fibre: number;
}
