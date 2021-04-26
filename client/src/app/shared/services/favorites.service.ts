import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../models/recipe.model';
import { HttpExceptionResponse } from '../interfaces/http-exception-response.interface';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpClient: HttpClient,
  ) {}

  public async favoriteRecipe(
    userName: string,
    slug: string,
  ): Promise<Recipe | any> {
    const favoriteRecipeUrl = `${
      this.configService.apiEndpointUrl
    }/users/${userName}/favorites/recipes/${slug}`;

    try {
      const recipes = await this.httpClient
        .post<Recipe>(favoriteRecipeUrl, {})
        .toPromise();

      return recipes;
    } catch (error) {
      return error.error;
    }
  }

  public async unfavoriteRecipe(
    userName: string,
    slug: string,
  ): Promise<Recipe | any> {
    const favoriteRecipeUrl = `${
      this.configService.apiEndpointUrl
    }/users/${userName}/favorites/recipes/${slug}`;

    try {
      const recipes = await this.httpClient
        .delete<Recipe>(favoriteRecipeUrl, {})
        .toPromise();

      return recipes;
    } catch (error) {
      return error.error;
    }
  }
}
