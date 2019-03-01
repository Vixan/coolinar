import { Column } from 'typeorm';
import { IsString, IsInt, Min } from 'class-validator';

export class Ingredient {
  @Column()
  @IsString()
  name: string;

  @Column()
  @IsInt()
  @Min(0)
  quantity: number;
}
