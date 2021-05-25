import { Injectable } from "@nestjs/common";
import { Recipe } from "src/recipes/recipes.entity";
import { RecipesService } from "src/recipes/recipes.service";
import { User } from "src/users/users.entity";
import { UsersService } from "../users/users.service";

@Injectable()
export class FavoritesService {
    constructor(
        private readonly usersService: UsersService,
        private readonly recipesService: RecipesService
    ) {}

    async findAll(user: User): Promise<Recipe[]> {
        return user.favoriteRecipes;
    }

    async favoriteRecipe(user: User, slug: string): Promise<User> {
        const recipe = await this.recipesService.findOneBySlug(slug);
        if (recipe) {
            user.favoriteRecipes.push(recipe);
        }

        return this.usersService.save(user);
    }

    async unfavoriteRecipe(user: User, recipeSlug: string): Promise<User> {
        user.favoriteRecipes = user.favoriteRecipes.filter(
            favoriteRecipe => favoriteRecipe.slug !== recipeSlug
        );

        return this.usersService.save(user);
    }
}
