import { Injectable } from '@angular/core';
import { ConfigService } from '../shared/services/config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Review } from '../shared/models/review.model';
import { Recipe } from '../shared/models/recipe.model';

@Injectable({
  providedIn: 'root',
})
export class ReviewsService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly configService: ConfigService,
  ) {}

  async createReview(review: Review, recipeSlug: string) {
    const createReviewUrl = `${this.configService.apiEndpointUrl}/reviews/${recipeSlug}`;

    try {
      return await this.httpClient
        .post<Review>(createReviewUrl, {
          ...review,
          author: review.author.slug,
        })
        .toPromise();
    } catch (error) {
      throw error.error;
    }
  }

  async updateReview(review: Review, recipeSlug: string) {
    const createReviewUrl = `${this.configService.apiEndpointUrl}/reviews/${recipeSlug}`;

    try {
      return await this.httpClient
        .put<Review>(createReviewUrl, {
          ...review,
          author: review.author.slug,
        })
        .toPromise();
    } catch (error) {
      throw error.error;
    }
  }

  async deleteReview(review: Review, recipeSlug: string) {
    const createReviewUrl = `${this.configService.apiEndpointUrl}/reviews/${recipeSlug}`;

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        ...review,
        author: review.author.slug
      },
    };

    try {
      return await this.httpClient
        .delete<Review>(createReviewUrl, options)
        .toPromise();
    } catch (error) {
      throw error.error;
    }
  }
}
