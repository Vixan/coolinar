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
import { Category } from '../category.entity';

export class RecipeValidationInterceptor implements NestInterceptor {
  constructor(
    @Inject(RecipesService) private readonly recipesService: RecipesService,
    @Inject(UsersService) private readonly usersService: UsersService,
  ) {}

  async intercept(
    context: ExecutionContext,
    call$: Observable<any>,
  ): Promise<any> {
    const request: Request = context.switchToHttp().getRequest();
    const createRecipeDto = plainToClass(CreateRecipeDto, request.body);

    await this.validateAuthor(createRecipeDto.author);
    await this.validateTitle(createRecipeDto.title);
    await this.validateNested(createRecipeDto);

    return call$;
  }

  private async validateNested(createRecipeDto: CreateRecipeDto) {
    const ingredients = createRecipeDto.ingredients.map(ingredient =>
      plainToClass(Ingredient, ingredient),
    );
    const directions = createRecipeDto.directions.map(direction =>
      plainToClass(Direction, direction),
    );
    const categories = createRecipeDto.categories.map(category =>
      plainToClass(Category, category),
    );
    const recipeDtoToValidate = plainToClass(CreateRecipeDto, {
      ...createRecipeDto,
      ingredients,
      categories,
      directions,
    });
    const validationErrors = await validate(recipeDtoToValidate);

    if (validationErrors.length > 0) {
      throw new BadRequestException({
        errors: ErrorUtils.createErrors(validationErrors),
      });
    }
  }

  private async validateAuthor(author: string) {
    const user = await this.usersService.findByName(author);

    if (!user) {
      throw new NotFoundException({
        errors: { author: 'Author username does not exist' },
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
}
