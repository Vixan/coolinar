import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Post,
    Put,
    Query,
    UseFilters,
    UseGuards,
    UseInterceptors,
    UsePipes
} from "@nestjs/common";
import { Category } from "src/categories/categories.entity";
import { Direction } from "src/directions/directions.entity";
import { Ingredient } from "src/ingredients/ingredients.entity";
import { HttpExceptionFilter } from "src/shared/filters/http-exception.filter";
import { Pagination } from "src/shared/pagination/pagination";
import { PaginationOptions } from "src/shared/pagination/pagination-options.interface";
import { PaginationTransformInterceptor } from "src/shared/pagination/pagination-transform.interceptor";
import { DatePart, DateProvider } from "src/shared/providers/date.provider";
import { CurrentUser } from "src/users/current-user.decorator";
import { JwtAuthGuard } from "../auth/strategies/jwt/jwt-auth.guard";
import { JwtPayload } from "../auth/strategies/jwt/jwt-payload.interface";
import { CategoriesService } from "../categories/categories.service";
import { DirectionsService } from "../directions/directions.service";
import { IngredientsService } from "../ingredients/ingredients.service";
import { TransformInterceptor } from "../shared/interceptors/transform.interceptor";
import { ValidationPipe } from "../shared/pipes/validation.pipe";
import { UsersService } from "../users/users.service";
import { CreateRecipeDto } from "./dto/create-recipe.dto";
import { RecipeDto } from "./dto/recipe.dto";
import { SearchRecipeDto } from "./dto/search-recipe.dto";
import { UpdateRecipeDto } from "./dto/update-recipe.dto";
import { RecipeValidationInterceptor } from "./interceptors/recipe-validation.interceptor";
import { Recipe } from "./recipes.entity";
import { RecipesService } from "./recipes.service";

@Controller("recipes")
@UseFilters(HttpExceptionFilter)
export class RecipesController {
    constructor(
        private readonly recipesService: RecipesService,
        private readonly usersService: UsersService,
        private readonly directionsService: DirectionsService,
        private readonly categoriesService: CategoriesService,
        private readonly ingredientsService: IngredientsService,
        private readonly dateProvider: DateProvider
    ) {}

    @Get()
    @UseInterceptors(new PaginationTransformInterceptor(RecipeDto))
    async getAll(
        @Query() pagination: PaginationOptions
    ): Promise<Pagination<Recipe>> {
        return await this.recipesService.paginate({
            take: Number(pagination.take) || 10,
            skip: Number(pagination.skip) || 0
        });
    }

    @Get("/daily")
    @UseInterceptors(new PaginationTransformInterceptor(RecipeDto))
    async getDaily(
        @Query() pagination: PaginationOptions
    ): Promise<Pagination<Recipe>> {
        const dateInterval = this.dateProvider.createDateInterval(
            new Date(),
            DatePart.DAY
        );

        return this.recipesService.findByCreatedDateInterval(dateInterval, {
            take: Number(pagination.take) || 10,
            skip: Number(pagination.skip) || 0
        });
    }

    @Get("/latest")
    @UseInterceptors(new PaginationTransformInterceptor(RecipeDto))
    async getLatest(
        @Query() pagination: PaginationOptions
    ): Promise<Pagination<Recipe>> {
        return this.recipesService.paginateAndSort(
            {
                take: Number(pagination.take) || 10,
                skip: Number(pagination.skip) || 0
            },
            "dateCreated"
        );
    }

    @Get("/top-rated")
    @UseInterceptors(new PaginationTransformInterceptor(RecipeDto))
    async getTopRated(
        @Query() pagination: PaginationOptions
    ): Promise<Pagination<Recipe>> {
        const minScore: number = 4;

        return this.recipesService.findByReviewMinScore(minScore, {
            take: Number(pagination.take) || 10,
            skip: Number(pagination.skip) || 0
        });
    }

    @Get("/search")
    @UseInterceptors(new PaginationTransformInterceptor(RecipeDto))
    async search(
        @Query() params: SearchRecipeDto,
        @Query() pagination: PaginationOptions
    ) {
        return this.recipesService.search(params, {
            take: Number(pagination.take) || 10,
            skip: Number(pagination.skip) || 0
        });
    }

    @Get(":slug")
    @UseInterceptors(new TransformInterceptor(RecipeDto))
    async getBySlug(@Param("slug") slug: string): Promise<Recipe> {
        const recipe = await this.recipesService.findOneBySlug(slug);

        if (!recipe) {
            throw new NotFoundException({
                errors: { slug: "Inexisting slug" }
            });
        }

        return recipe;
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    @UseInterceptors(
        RecipeValidationInterceptor,
        new TransformInterceptor(RecipeDto)
    )
    async create(@Body() createRecipeDto: CreateRecipeDto): Promise<Recipe> {
        const categories: Category[] = [];
        for (const categoryName of createRecipeDto.categories) {
            let foundCategory = await this.categoriesService.findByName(
                categoryName
            );
            if (!foundCategory) {
                foundCategory = await this.categoriesService.create(
                    new Category({ name: categoryName })
                );
            }
            categories.push(foundCategory);
        }

        const ingredients: Ingredient[] = [];
        for (const ingredientName of createRecipeDto.ingredients) {
            let foundIngredient = await this.ingredientsService.findByName(
                ingredientName
            );
            if (!foundIngredient) {
                foundIngredient = await this.ingredientsService.create(
                    new Ingredient({ name: ingredientName })
                );
            }
            ingredients.push(foundIngredient);
        }

        const directions: Direction[] = [];
        for (const directionName of createRecipeDto.directions) {
            let foundDirection = await this.directionsService.findByName(
                directionName
            );
            if (!foundDirection) {
                foundDirection = await this.directionsService.create(
                    new Direction({ name: directionName })
                );
            }
            directions.push(foundDirection);
        }

        const author = await this.usersService.findOneBySlug(
            createRecipeDto.author
        );

        const recipe = new Recipe({
            ...createRecipeDto,
            author,
            categories,
            ingredients,
            directions
        });

        return this.recipesService.create(recipe);
    }

    @Put(":slug")
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    @UseInterceptors(new TransformInterceptor(RecipeDto))
    async update(
        @Param("slug") slug: string,
        @Body() updateRecipeDto: Partial<UpdateRecipeDto>
    ): Promise<Recipe> {
        const recipe = await this.recipesService.findOneBySlug(slug);

        if (!recipe) {
            throw new NotFoundException({
                errors: { slug: "Inexistent slug" }
            });
        }

        const categories: Category[] = [];
        for (const categoryName of updateRecipeDto.categories) {
            let foundCategory = await this.categoriesService.findByName(
                categoryName
            );
            if (!foundCategory) {
                foundCategory = await this.categoriesService.create(
                    new Category({ name: categoryName })
                );
            }
            categories.push(foundCategory);
        }

        const ingredients: Ingredient[] = [];
        for (const ingredientName of updateRecipeDto.ingredients) {
            let foundIngredient = await this.ingredientsService.findByName(
                ingredientName
            );
            if (!foundIngredient) {
                foundIngredient = await this.ingredientsService.create(
                    new Ingredient({ name: ingredientName })
                );
            }
            ingredients.push(foundIngredient);
        }

        const directions: Direction[] = [];
        for (const directionName of updateRecipeDto.directions) {
            let foundDirection = await this.directionsService.findByName(
                directionName
            );
            if (!foundDirection) {
                foundDirection = await this.directionsService.create(
                    new Direction({ name: directionName })
                );
            }
            directions.push(foundDirection);
        }

        recipe.title = updateRecipeDto.title;
        recipe.description = updateRecipeDto.description;
        recipe.cookingTime = updateRecipeDto.cookingTime;
        recipe.preparationTime = updateRecipeDto.preparationTime;
        recipe.imageUrls = updateRecipeDto.imageUrls;
        recipe.notes = updateRecipeDto.notes;
        recipe.nutrition = updateRecipeDto.nutrition;
        recipe.categories = categories;
        recipe.ingredients = ingredients;
        recipe.directions = directions;

        return this.recipesService.update(recipe);
    }

    @Delete(":slug")
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    @UseInterceptors(new TransformInterceptor(RecipeDto))
    async delete(
        @CurrentUser() currentUser: JwtPayload,
        @Param("slug") slug: string
    ): Promise<Recipe> {
        const recipe = await this.recipesService.findOneBySlug(slug);

        if (!recipe) {
            throw new NotFoundException({
                errors: { slug: "Recipe not found" }
            });
        }

        const user = await this.usersService.findOneByEmail(currentUser.email);
        if (user.id !== recipe.author.id) {
            throw new NotFoundException({
                errors: { author: "Cannot delete a recipe that is not owned" }
            });
        }

        return this.recipesService.delete(recipe);
    }
}
