import { Injectable } from "@nestjs/common";
import { Recipe } from "src/recipes/recipes.entity";
import { RecipesService } from "src/recipes/recipes.service";
import { User } from "src/users/users.entity";
import { UsersService } from "../users/users.service";

/**
 * Injectable service that exposes methods for handling user favorites.
 *
 * @class FavoritesService
 */
@Injectable()
export class FavoritesService {
    constructor(
        private readonly usersService: UsersService,
        private readonly recipesService: RecipesService
    ) {}

    /**
     * Retrieve the list of favorite user recipes from the database.
     *
     * @param {User} user
     * @returns {Promise<Recipe[]>} List of favorite user recipes.
     * @memberof FavoritesService
     */
    async findAll(user: User): Promise<Recipe[]> {
        return user.favoriteRecipes;
    }

    /**
     * Add recipe to the list of favorites in the database.
     *
     * @param {User} user
     * @param {string} recipeSlug Recipe slug.
     * @returns {Promise<User>} Promise of the list owner.
     * @memberof FavoritesService
     */
    async favoriteRecipe(user: User, slug: string): Promise<User> {
        const recipe = await this.recipesService.findOneBySlug(slug);
        if (recipe) {
            user.favoriteRecipes.push(recipe);
        }

        return this.usersService.save(user);
    }

    /**
     * Remove the recipe from the list of user favorites.
     *
     * @param {User} user
     * @param {string} recipeSlug Recipe slug to be removed from the list.
     * @returns {Promise<User>} Promise of the list owner.
     * @memberof FavoritesService
     */
    async unfavoriteRecipe(user: User, recipeSlug: string): Promise<User> {
        user.favoriteRecipes = user.favoriteRecipes.filter(
            favoriteRecipe => favoriteRecipe.slug !== recipeSlug
        );

        return this.usersService.save(user);
    }
}
