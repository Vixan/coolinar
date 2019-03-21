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
