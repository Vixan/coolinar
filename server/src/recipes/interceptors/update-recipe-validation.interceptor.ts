import {
  NestInterceptor,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Ingredient } from '../ingredients.entity';
import { Direction } from '../directions.entity';
import { ErrorUtils } from '../../shared/utils/error.utils';
import { UpdateRecipeDto } from '../dto/update-recipe.dto';

export class UpdateRecipeValidationInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    stream$: Observable<any>,
  ): Promise<any> {
    const request: Request = context.switchToHttp().getRequest();
    const updateRecipeDto = plainToClass(UpdateRecipeDto, request.body);

    await this.validateIngredients(updateRecipeDto.ingredients);
    await this.validateDirections(updateRecipeDto.directions);

    return stream$;
  }

  private async validateIngredients(ingredients: Ingredient[]) {
    if (!ingredients.length) {
      throw new BadRequestException({
        errors: { ingredients: 'Recipe must have minimum 1 ingredient' },
      });
    }

    for (const ingredientPlainObject of ingredients) {
      const ingredient = plainToClass(Ingredient, ingredientPlainObject);
      const validationErrors = await validate(ingredient);

      if (validationErrors.length) {
        throw new BadRequestException({
          errors: ErrorUtils.toErrors(validationErrors),
        });
      }
    }
  }

  private async validateDirections(directions: Direction[]) {
    if (!directions.length) {
      throw new BadRequestException({
        errors: { ingredients: 'Recipe must have minimum 1 direction' },
      });
    }

    for (const directionPlainObject of directions) {
      const direction = plainToClass(Direction, directionPlainObject);
      const validationErrors = await validate(direction);

      if (validationErrors.length) {
        throw new BadRequestException({
          errors: ErrorUtils.toErrors(validationErrors),
        });
      }
    }
  }
}
