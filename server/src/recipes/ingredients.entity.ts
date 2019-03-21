import { Column } from 'typeorm';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  ValidateIf,
  IsOptional,
} from 'class-validator';

export enum IngredientMeasurementUnits {
  Cup = 'cup',
  Teaspoon = 'teaspoon',
  Tablespoon = 'tablespoon',
  Ounce = 'ounce',
  Pinch = 'pinch',
  Stalk = 'stalk',
  Sheet = 'sheet',
  Kilogram = 'kilogram',
  Pound = 'pound',
  Head = 'head',
}

const formattedMeasurementUnits = Object.values(
  IngredientMeasurementUnits,
).join(', ');

export class Ingredient {
  @Column()
  @IsNotEmpty({ message: 'Ingredient name is required' })
  @IsString({ message: 'Ingredient name must be a string' })
  name: string;

  @Column()
  @IsNotEmpty({ message: 'Ingredient quantity is required' })
  quantity: number | string;

  @Column()
  @IsOptional()
  @ValidateIf(ingredient => typeof ingredient.unit !== 'undefined')
  @IsEnum(IngredientMeasurementUnits, {
    message: `Ingredient measurement must be one of: ${formattedMeasurementUnits}`,
  })
  unit: IngredientMeasurementUnits;
}
