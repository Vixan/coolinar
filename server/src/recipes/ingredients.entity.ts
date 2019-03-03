import { Column } from 'typeorm';
import { IsString, IsInt, Min, IsNotEmpty } from 'class-validator';

export class Ingredient {
  @Column()
  @IsNotEmpty({ message: 'Ingredient name is required' })
  @IsString({ message: 'Ingredient name must be a string' })
  name: string;

  @Column()
  @IsInt({ message: 'Ingredient quantity must be an integer' })
  @Min(1, {
    message: 'Ingredient quantity must be a positive non-zero integer',
  })
  quantity: number;
}
