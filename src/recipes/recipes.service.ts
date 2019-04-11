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

@Injectable()
export class RecipesService extends BaseService<Recipe> {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipesRepository: Repository<Recipe>,
    private readonly slugProvider: SlugProvider,
  ) {
    super(recipesRepository);
  }

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

  async findBySlug(slug: string) {
    return this.recipesRepository.findOne({
      slug,
    });
  }

  async findByTitle(title: string) {
    return this.recipesRepository.findOne({
      title,
    });
  }

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

  async fingByIngredients(
    ingredientNames: string[],
    paginationOptions?: PaginationOptions,
  ): Promise<Pagination<Recipe>> {
    const [results, total] = await this.recipesRepository.findAndCount({
      where: {
        ingredients: { $regex: new RegExp(ingredientNames.join('|'), 'i') },
      },
      ...paginationOptions,
    });

    return new Pagination<Recipe>({
      results,
      total,
    });
  }

  async fingByCategories(
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

  async create(recipe: Recipe) {
    recipe.slug = this.slugProvider.createSlug(recipe.title, { lower: true });
    recipe.averageReviewScore = 0;
    recipe.reviews = recipe.reviews || [];
    recipe.imageUrls = recipe.imageUrls || [];

    return this.recipesRepository.save(recipe);
  }

  async update(recipe: Recipe) {
    recipe.slug = this.slugProvider.createSlug(recipe.title, { lower: true });
    recipe.averageReviewScore =
      recipe.reviews.reduce(
        (totalScore, review) => review.score + totalScore,
        0,
      ) / recipe.reviews.length;

    return this.recipesRepository.save(recipe);
  }

  async delete(recipe: Recipe) {
    return this.recipesRepository.remove(recipe);
  }
}
