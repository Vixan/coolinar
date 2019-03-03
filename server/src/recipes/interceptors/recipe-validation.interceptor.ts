import {
  NestInterceptor,
  ExecutionContext,
  ConflictException,
  BadRequestException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Ingredient } from '../ingredients.entity';
import { Direction } from '../directions.entity';
import { UsersService } from '../../users/users.service';
import { RecipesService } from '../recipes.service';
import { ErrorUtils } from '../../shared/utils/error.utils';
import { CreateRecipeDto } from '../dto/create-recipe.dto';

export class RecipeValidationInterceptor implements NestInterceptor {
  constructor(
    @Inject(RecipesService) private readonly recipesService: RecipesService,
    @Inject(UsersService) private readonly usersService: UsersService,
  ) {}

  async intercept(
    context: ExecutionContext,
    stream$: Observable<any>,
  ): Promise<any> {
    const request: Request = context.switchToHttp().getRequest();
    const createRecipeDto = plainToClass(CreateRecipeDto, request.body);

    await this.validateAuthor(createRecipeDto.createdBy);
    await this.validateTitle(createRecipeDto.title);
    await this.validateIngredients(createRecipeDto.ingredients);
    await this.validateDirections(createRecipeDto.directions);

    return stream$;
  }

  private async validateAuthor(author: string) {
    const user = await this.usersService.findByName(author);

    if (!user) {
      throw new NotFoundException({
        errors: { createdBy: 'Author username does not exist' },
      });
    }
  }

  private async validateTitle(title: string) {
    const recipeByTitle = await this.recipesService.findByTitle(title);

    if (recipeByTitle) {
      throw new ConflictException({
        errors: { title: 'Recipe with specified title already exists' },
      });
    }
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
