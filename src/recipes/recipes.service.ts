import { Injectable } from '@nestjs/common';
import { BaseService } from '../shared/base/base.service';
import { Recipe } from './recipes.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  Between,
  MoreThanOrEqual,
  Like,
  In,
  Raw,
  SelectQueryBuilder,
} from 'typeorm';
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
      relations: [
        'categories',
        'ingredients',
        'directions',
        'reviews',
        'author',
        'reviews.author',
      ],
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
      relations: [
        'categories',
        'ingredients',
        'directions',
        'reviews',
        'author',
        'reviews.author',
      ],
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
    return this.recipesRepository.findOne(
      {
        slug,
      },
      {
        relations: [
          'categories',
          'ingredients',
          'directions',
          'reviews',
          'author',
          'reviews.author',
        ],
      },
    );
  }

  /**
   * Retrieve recipe by title.
   *
   * @param {string} slug Recipe slug.
   * @returns {Promise<Recipe>} Promise of the recipe.
   * @memberof RecipesService
   */
  async findByTitle(title: string): Promise<Recipe> {
    return this.recipesRepository.findOne(
      {
        title,
      },
      {
        relations: [
          'categories',
          'ingredients',
          'directions',
          'reviews',
          'author',
          'reviews.author',
        ],
      },
    );
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
        relations: [
          'categories',
          'ingredients',
          'directions',
          'reviews',
          'author',
          'reviews.author',
        ],
        dateCreated: Between(dateInterval.start, dateInterval.end),
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
        relations: [
          'categories',
          'ingredients',
          'directions',
          'reviews',
          'author',
          'reviews.author',
        ],
        reviews: { score: MoreThanOrEqual(reviewScore) },
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
    let query = this.recipesRepository.manager
      .createQueryBuilder(Recipe, 'recipe')
      .leftJoinAndSelect('recipe.author', 'author')
      .leftJoinAndSelect('recipe.ingredients', 'ingredient')
      .leftJoinAndSelect('recipe.directions', 'direction')
      .leftJoinAndSelect('recipe.categories', 'category')
      .leftJoinAndSelect('recipe.reviews', 'review')
      .skip(paginationOptions.skip)
      .take(paginationOptions.take);

    if (searchRecipeDto.title) {
      query = query.andWhere(`recipe.title ILIKE :title`, {
        title: `%${searchRecipeDto.title}%`,
      });
    }

    if (searchRecipeDto.author) {
      query = query.andWhere(`author.slug = :author`, {
        author: searchRecipeDto.author,
      });
    }

    if (searchRecipeDto.ingredients) {
      query = query.andWhere(`ingredient.name ILIKE ANY(:ingredients)`, {
        ingredients: searchRecipeDto.ingredients.map(i => `%${i}%`),
      });
    }

    if (searchRecipeDto.categories) {
      query = query.andWhere(`category.name ILIKE ANY(:categories)`, {
        categories: searchRecipeDto.categories.map(c => `%${c}%`),
      });
    }

    const [results, total] = await query.getManyAndCount();

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
        relations: [
          'categories',
          'ingredients',
          'directions',
          'reviews',
          'author',
          'reviews.author',
        ],
        title: Like(title),
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
        relations: [
          'categories',
          'ingredients',
          'directions',
          'reviews',
          'author',
          'reviews.author',
        ],
        ingredients: {
          name: In(ingredients),
        },
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
        relations: [
          'categories',
          'ingredients',
          'directions',
          'reviews',
          'author',
          'reviews.author',
        ],
        categories: {
          name: In(categorySlugs),
        },
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
    if (recipe.reviews) {
      recipe.averageReviewScore =
        recipe.reviews.reduce(
          (totalScore, review) => review.score + totalScore,
          0,
        ) / recipe.reviews.length;
    }

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
