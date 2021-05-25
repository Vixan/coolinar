import {
    CallHandler, ConflictException, ExecutionContext,


    Inject, NestInterceptor,


    NotFoundException
} from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { UsersService } from "../../users/users.service";
import { CreateRecipeDto } from "../dto/create-recipe.dto";
import { RecipesService } from "../recipes.service";

export class RecipeValidationInterceptor implements NestInterceptor {
    constructor(
        @Inject(RecipesService) private readonly recipesService: RecipesService,
        @Inject(UsersService) private readonly usersService: UsersService
    ) {}

    async intercept(
        context: ExecutionContext,
        next: CallHandler
    ): Promise<any> {
        const request: Request = context.switchToHttp().getRequest();
        const createRecipeDto = plainToClass(CreateRecipeDto, request.body);

        await this.validateAuthor(createRecipeDto.author);
        await this.validateTitle(createRecipeDto.title);

        return next.handle();
    }

    private async validateAuthor(author: string) {
        const user = await this.usersService.findOneBySlug(author);

        if (!user) {
            throw new NotFoundException({
                errors: {
                    author: "Specified author is not an existing username"
                }
            });
        }
    }

    private async validateTitle(title: string) {
        const recipe = await this.recipesService.findByTitle(title);

        if (recipe) {
            throw new ConflictException({
                errors: { title: "Recipe with specified title already exists" }
            });
        }
    }
}
