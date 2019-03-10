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
import { Category } from '../category.entity';

export class UpdateRecipeValidationInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    stream$: Observable<any>,
  ): Promise<any> {
    const request: Request = context.switchToHttp().getRequest();
    const updateRecipeDto = plainToClass(UpdateRecipeDto, request.body);

    await this.validateNested(updateRecipeDto);

    return stream$;
  }

  private async validateNested(updateRecipeDto: UpdateRecipeDto) {
    const ingredients = updateRecipeDto.ingredients.map(ingredient =>
      plainToClass(Ingredient, ingredient),
    );
    const directions = updateRecipeDto.directions.map(direction =>
      plainToClass(Direction, direction),
    );
    const categories = updateRecipeDto.categories.map(category =>
      plainToClass(Category, category),
    );
    const recipeDtoToValidate = plainToClass(UpdateRecipeDto, {
      ...updateRecipeDto,
      ingredients,
      directions,
      categories,
    });
    const validationErrors = await validate(recipeDtoToValidate);

    if (validationErrors.length > 0) {
      throw new BadRequestException({
        errors: ErrorUtils.createErrors(validationErrors),
      });
    }
  }
}
