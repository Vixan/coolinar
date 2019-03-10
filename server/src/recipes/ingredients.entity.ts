import { Column } from 'typeorm';
import {
  IsString,
  IsInt,
  Min,
  IsNotEmpty,
  IsEnum,
  ValidateIf,
} from 'class-validator';

export enum IngredientMeasurementUnits {
  Cup = 'cup',
  Teaspoon = 'teaspoon',
  Tablespoon = 'tablespoon',
  Ounce = 'ounce',
  Pinch = 'pinch',
}

const formattedMeasurementUnits = Object.values(IngredientMeasurementUnits).join(', ');

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

  @Column()
  @ValidateIf(ingredient => typeof ingredient.unit !== 'undefined')
  @IsEnum(IngredientMeasurementUnits, {
    message: `Ingredient measurement must be one of: ${formattedMeasurementUnits}`,
  })
  unit: IngredientMeasurementUnits;
}
