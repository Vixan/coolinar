import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigService } from '../shared/services/config.service';
import { PaginationOptions } from '../pagination/pagination-options.interface';
import { Recipe } from '../shared/models/recipe.model';
import { SearchRecipes } from './explore-recipes/interfaces/search-recipes';
import { PaginationResults } from '../pagination/pagination-results.interface';

@Injectable({
  providedIn: 'root',
})
export class RecipesService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly configService: ConfigService,
  ) {}

  async getAll(
    paginationOptions: PaginationOptions,
  ): Promise<PaginationResults<Recipe>> {
    const getAllRecipesUrl = `${this.configService.apiEndpointUrl}/recipes`;

    try {
      const recipes = await this.httpClient
        .get<PaginationResults<Recipe>>(getAllRecipesUrl, {
          params: {
            take: `${paginationOptions.take}`,
            skip: `${paginationOptions.skip}`,
          },
        })
        .toPromise();

      return recipes;
    } catch (error) {
      throw error.error;
    }
  }

  async search(
    paginationOptions: PaginationOptions,
    searchRecipes: SearchRecipes,
  ): Promise<PaginationResults<Recipe>> {
    const searchRecipesUrl = `${
      this.configService.apiEndpointUrl
    }/recipes/search`;

    let params = new HttpParams();

    params = params.append('title', searchRecipes.title);
    searchRecipes.ingredients.forEach(ingredient => {
      params = params.append(`ingredients[]`, ingredient);
    });
    searchRecipes.categories.forEach(category => {
      params = params.append(`categories[]`, category);
    });
    params = params.append('take', `${paginationOptions.take}`);
    params = params.append('skip', `${paginationOptions.skip}`);

    try {
      const recipes = await this.httpClient
        .get<PaginationResults<Recipe>>(searchRecipesUrl, {
          params,
        })
        .toPromise();

      return recipes;
    } catch (error) {
      throw error.error;
    }
  }

  async getDaily(
    paginationOptions: PaginationOptions,
  ): Promise<PaginationResults<Recipe>> {
    const getDailyRecipesUrl = `${
      this.configService.apiEndpointUrl
    }/recipes/daily`;

    try {
      const recipes = await this.httpClient
        .get<PaginationResults<Recipe>>(getDailyRecipesUrl, {
          params: {
            take: `${paginationOptions.take}`,
            skip: `${paginationOptions.skip}`,
          },
        })
        .toPromise();

      return recipes;
    } catch (error) {
      throw error.error;
    }
  }

  async getTopRated(
    paginationOptions: PaginationOptions,
  ): Promise<PaginationResults<Recipe>> {
    const getTopRatedRecipesUrl = `${
      this.configService.apiEndpointUrl
    }/recipes/top-rated`;

    try {
      const recipes = await this.httpClient
        .get<PaginationResults<Recipe>>(getTopRatedRecipesUrl, {
          params: {
            take: `${paginationOptions.take}`,
            skip: `${paginationOptions.skip}`,
          },
        })
        .toPromise();

      return recipes;
    } catch (error) {
      throw error.error;
    }
  }

  async getLatest(
    paginationOptions: PaginationOptions,
  ): Promise<PaginationResults<Recipe>> {
    const getTopRatedRecipesUrl = `${
      this.configService.apiEndpointUrl
    }/recipes/latest`;

    try {
      const recipes = await this.httpClient
        .get<PaginationResults<Recipe>>(getTopRatedRecipesUrl, {
          params: {
            take: `${paginationOptions.take}`,
            skip: `${paginationOptions.skip}`,
          },
        })
        .toPromise();

      return recipes;
    } catch (error) {
      throw error.error;
    }
  }

  async getFavorites(userSlug: string): Promise<Recipe[]> {
    const getFavoritesUrl = `${
      this.configService.apiEndpointUrl
    }/users/${userSlug}/favorites/recipes`;

    try {
      const recipes = await this.httpClient
        .get<Recipe[]>(getFavoritesUrl)
        .toPromise();

      return recipes;
    } catch (error) {
      throw error.error;
    }
  }

  async getCreated(userSlug: string, paginationOptions: PaginationOptions): Promise<PaginationResults<Recipe>> {
    const getFavoritesUrl = `${
      this.configService.apiEndpointUrl
    }/recipes/search`;

    let params = new HttpParams();
    params = params.append('author', userSlug);
    params = params.append('take', `${paginationOptions.take}`);
    params = params.append('skip', `${paginationOptions.skip}`);

    try {
      const recipes = await this.httpClient
        .get<PaginationResults<Recipe>>(getFavoritesUrl, {
          params,
        })
        .toPromise();

      return recipes;
    } catch (error) {
      throw error.error;
    }
  }

  async getBySlug(slug: string): Promise<Recipe | null> {
    const getTopRatedRecipesUrl = `${
      this.configService.apiEndpointUrl
    }/recipes/${slug}`;

    try {
      const recipe = await this.httpClient
        .get<Recipe>(getTopRatedRecipesUrl)
        .toPromise();

      return recipe;
    } catch (error) {
      throw error.error;
    }
  }

  async create(recipeToCreate: Recipe): Promise<Recipe | null> {
    const getTopRatedRecipesUrl = `${
      this.configService.apiEndpointUrl
    }/recipes/`;

    try {
      const recipe = await this.httpClient
        .post<Recipe>(getTopRatedRecipesUrl, recipeToCreate)
        .toPromise();

      return recipe;
    } catch (error) {
      throw error.error;
    }
  }
}
