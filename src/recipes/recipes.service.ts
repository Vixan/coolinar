import { Injectable } from '@nestjs/common';
import { BaseService } from '../shared/base/base.service';
import { Recipe } from './recipes.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SlugProvider } from '../shared/providers/slug.provider';
import { DateInterval } from 'src/shared/providers/date.provider';
import { PaginationOptions } from 'src/shared/pagination/pagination-options.interface';
import { SearchRecipeDto } from './dto/search-recipe.dto';
import { Pagination } from 'src/shared/pagination/pagination';

/**
 * Injectable service that handles recipes database logic.
 *
 * @class RecipesService
 * @extends {BaseService<Recipe>}
 */
@Injectable()
export class RecipesService extends BaseService<Recipe> {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipesRepository: Repository<Recipe>,
    private readonly slugProvider: SlugProvider,
  ) {
    super(recipesRepository);
  }

  /**
   * Paginate database recipes.
   *
   * @param {PaginationOptions} paginationOptions
   * @returns {Promise<Pagination<Recipe>>} Promise of the recipes pagination.
   * @memberof RecipesService
   */
  async paginate(
    paginationOptions: PaginationOptions,
  ): Promise<Pagination<Recipe>> {
    const [results, total] = await this.recipesRepository.findAndCount({
      ...paginationOptions,
    });

    return new Pagination<Recipe>({
      results,
      total,
    });
  }

  /**
   * Paginate database recipes and retrieve them sorted in the specified order.
   *
   * @param {PaginationOptions} paginationOptions
   * @param {string} sortBy Key to sort recipes by.
   * @param {boolean} [isAscending] Sorting order ascending or descending.
   * @returns {Promise<Pagination<Recipe>>} Promise of the paginated recipes.
   * @memberof RecipesService
   */
  async paginateAndSort(
    paginationOptions: PaginationOptions,
    sortBy: string,
    isAscending?: boolean,
  ): Promise<Pagination<Recipe>> {
    const [results, total] = await this.recipesRepository.findAndCount({
      order: { [sortBy]: isAscending ? 1 : -1 },
      ...paginationOptions,
    });

    return new Pagination<Recipe>({
      results,
      total,
    });
  }

  /**
   * Retrieve recipe by slug.
   *
   * @param {string} slug Recipe slug.
   * @returns {Promise<Recipe>} Promise of the recipe.
   * @memberof RecipesService
   */
  async findBySlug(slug: string): Promise<Recipe> {
    return this.recipesRepository.findOne({
      slug,
    });
  }

  /**
   * Retrieve recipe by title.
   *
   * @param {string} slug Recipe slug.
   * @returns {Promise<Recipe>} Promise of the recipe.
   * @memberof RecipesService
   */
  async findByTitle(title: string): Promise<Recipe> {
    return this.recipesRepository.findOne({
      title,
    });
  }

  /**
   * Retrieve database recipes by a date interval and pagination.
   *
   * @param {DateInterval} dateInterval The interval of a date (e.g. whole day, whole month, etc.).
   * @param {PaginationOptions} [paginationOptions]
   * @returns {Promise<Pagination<Recipe>>} Promise of the recipes pagination.
   * @memberof RecipesService
   */
  async findByCreatedDateInterval(
    dateInterval: DateInterval,
    paginationOptions?: PaginationOptions,
  ): Promise<Pagination<Recipe>> {
    const [results, total] = await this.recipesRepository.findAndCount({
      where: {
        dateCreated: { $gte: dateInterval.start, $lt: dateInterval.end },
      },
      ...paginationOptions,
    });

    return new Pagination<Recipe>({
      results,
      total,
    });
  }

  /**
   * Retrieve database recipes by a minimum review score and pagination.
   *
   * @param {number} reviewScore Minimum review score.
   * @param {PaginationOptions} [paginationOptions]
   * @returns {Promise<Pagination<Recipe>>} Promise of the recipes pagination.
   * @memberof RecipesService
   */
  async findByReviewMinScore(
    reviewScore: number,
    paginationOptions?: PaginationOptions,
  ): Promise<Pagination<Recipe>> {
    const [results, total] = await this.recipesRepository.findAndCount({
      where: {
        'reviews.score': { $gte: reviewScore },
      },
      order: { averageReviewScore: -1 },
      ...paginationOptions,
    });

    return new Pagination<Recipe>({
      results,
      total,
    });
  }

  /**
   * Retrieve searched and paginated database recipes.
   *
   * @param {SearchRecipeDto} searchRecipeDto Search options.
   * @param {PaginationOptions} [paginationOptions]
   * @returns {Promise<Pagination<Recipe>>} Promise of the recipes pagination.
   * @memberof RecipesService
   */
  async search(
    searchRecipeDto: SearchRecipeDto,
    paginationOptions?: PaginationOptions,
  ): Promise<Pagination<Recipe>> {
    const conditions = [];

    if (searchRecipeDto.title) {
      conditions.push({
        title: { $regex: new RegExp(searchRecipeDto.title, 'i') },
      });
    }
    if (searchRecipeDto.ingredients) {
      searchRecipeDto.ingredients.forEach(ingredient => {
        conditions.push({
          ingredients: { $regex: new RegExp(ingredient, 'i') },
        });
      });
    }
    if (searchRecipeDto.categories) {
      searchRecipeDto.categories.forEach(category => {
        conditions.push({ categories: { $regex: new RegExp(category, 'i') } });
      });
    }

    if (!conditions.length) {
      return null;
    }

    const [results, total] = await this.recipesRepository.findAndCount({
      where: { $and: conditions },
      order: { title: -1 },
      ...paginationOptions,
    });

    return new Pagination<Recipe>({
      results,
      total,
    });
  }

  /**
   * Retrieve and paginate recipes that match a certain title.
   *
   * @param {string} title
   * @param {PaginationOptions} [paginationOptions]
   * @returns {Promise<Pagination<Recipe>>} Promise of the recipes pagination.
   * @memberof RecipesService
   */
  async findByTitleMatch(
    title: string,
    paginationOptions?: PaginationOptions,
  ): Promise<Pagination<Recipe>> {
    const [results, total] = await this.recipesRepository.findAndCount({
      where: {
        title: { $regex: new RegExp(title, 'i') },
      },
      ...paginationOptions,
    });

    return new Pagination<Recipe>({
      results,
      total,
    });
  }

  /**
   * Retrieve and paginate recipes that match at least one specified ingredient.
   *
   * @param {string[]} ingredients
   * @param {PaginationOptions} [paginationOptions]
   * @returns {Promise<Pagination<Recipe>>} Promise of the recipes pagination.
   * @memberof RecipesService
   */
  async findBySomeIngredients(
    ingredients: string[],
    paginationOptions?: PaginationOptions,
  ): Promise<Pagination<Recipe>> {
    const [results, total] = await this.recipesRepository.findAndCount({
      where: {
        ingredients: { $regex: new RegExp(ingredients.join('|'), 'i') },
      },
      ...paginationOptions,
    });

    return new Pagination<Recipe>({
      results,
      total,
    });
  }

  /**
   * Retrieve and paginate recipes that match at least one specified category.
   *
   * @param {string[]} categorySlugs Category slugs.
   * @param {PaginationOptions} [paginationOptions]
   * @returns {Promise<Pagination<Recipe>>} Promise of the recipes pagination.
   * @memberof RecipesService
   */
  async findBySomeCategories(
    categorySlugs: string[],
    paginationOptions?: PaginationOptions,
  ): Promise<Pagination<Recipe>> {
    const [results, total] = await this.recipesRepository.findAndCount({
      where: {
        categories: { $regex: new RegExp(categorySlugs.join('|'), 'i') },
      },
      ...paginationOptions,
    });

    return new Pagination<Recipe>({
      results,
      total,
    });
  }

  /**
   * Add the recipe to the database.
   *
   * @param {Recipe} recipe Recipe to be created.
   * @returns {Promise<Recipe>} Promise of the created recipe.
   * @memberof RecipesService
   */
  async create(recipe: Recipe): Promise<Recipe> {
    recipe.slug = this.slugProvider.createSlug(recipe.title, { lower: true });
    recipe.averageReviewScore = 0;
    recipe.reviews = recipe.reviews || [];
    recipe.imageUrls = recipe.imageUrls || [];

    return this.recipesRepository.save(recipe);
  }

  /**
   * Update the specified recipe in the database.
   *
   * @param {Recipe} recipe Recipe to be updated.
   * @returns {Promise<Recipe>} Promise of the updated recipe.
   * @memberof RecipesService
   */
  async update(recipe: Recipe): Promise<Recipe> {
    recipe.slug = this.slugProvider.createSlug(recipe.title, { lower: true });
    recipe.averageReviewScore =
      recipe.reviews.reduce(
        (totalScore, review) => review.score + totalScore,
        0,
      ) / recipe.reviews.length;

    return this.recipesRepository.save(recipe);
  }

  /**
   * Remove the recipe from the database.
   *
   * @param {Recipe} recipe Recipe to be removed.
   * @returns {Promise<Recipe>} Promise of the removed recipe.
   * @memberof RecipesService
   */
  async delete(recipe: Recipe): Promise<Recipe> {
    return this.recipesRepository.remove(recipe);
  }
}
