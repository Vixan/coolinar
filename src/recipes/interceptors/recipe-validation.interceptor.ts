import {
  NestInterceptor,
  ExecutionContext,
  ConflictException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { plainToClass } from 'class-transformer';
import { UsersService } from '../../users/users.service';
import { RecipesService } from '../recipes.service';
import { CreateRecipeDto } from '../dto/create-recipe.dto';

/**
 * Http interceptor for recipe validation.
 *
 * @export
 * @class RecipeValidationInterceptor
 * @implements {NestInterceptor}
 */
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

    return call$;
  }

  private async validateAuthor(author: string) {
    const user = await this.usersService.findBySlug(author);

    if (!user) {
      throw new NotFoundException({
        errors: { author: 'Specified author is not an existing username' },
      });
    }
  }

  private async validateTitle(title: string) {
    const recipe = await this.recipesService.findByTitle(title);

    if (recipe) {
      throw new ConflictException({
        errors: { title: 'Recipe with specified title already exists' },
      });
    }
  }
}
