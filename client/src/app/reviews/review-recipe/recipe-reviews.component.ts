import { Component, OnInit, Input } from '@angular/core';
import { ReviewsService } from '../reviews.service';
import { UsersService } from 'src/app/users/users.service';
import { User } from 'src/app/shared/models/user.model';
import { Review } from 'src/app/shared/models/review.model';
import { Recipe } from 'src/app/shared/models/recipe.model';

@Component({
  selector: 'app-recipe-reviews',
  templateUrl: './recipe-reviews.component.html',
  styleUrls: ['./recipe-reviews.component.css'],
})
export class RecipeReviewsComponent implements OnInit {
  reviewedRecipe: Recipe;
  reviews: Review[];
  user: User;
  review: Review;
  ratingTooltips = ['Terrible', 'Bad', 'Average', 'Good', 'Wonderful'];
  isEditing = false;
  isLoading = false;

  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly usersService: UsersService,
  ) {}

  ngOnInit() {
    this.initUser();
  }

  @Input()
  public set recipe(recipe: Recipe) {
    this.reviewedRecipe = recipe;
  }

  private async initUser(): Promise<void> {
    try {
      this.user = await this.usersService.getFromToken();

      if (this.user) {
        this.resetReview();
      }
    } catch (error) {
      console.log(error);
    }
  }

  async createReview() {
    try {
      await this.reviewsService.createReview(
        this.review,
        this.reviewedRecipe.slug,
      );
      this.addDisplayedReview();
      this.isEditing = false;
    } catch (error) {
      console.log(error);
    }
  }

  async updateReview() {
    try {
      await this.reviewsService.updateReview(
        this.review,
        this.reviewedRecipe.slug,
      );
      this.isEditing = false;
    } catch (error) {
      console.log(error);
    }
  }

  enableEditing() {
    this.isEditing = true;
    this.review = this.currentUserReview;
  }

  async deleteReview() {
    try {
      this.isLoading = true;
      console.log(this.review)
      await this.reviewsService.deleteReview(
        this.review,
        this.reviewedRecipe.slug,
      );
      this.deleteDisplayedReview();
      this.resetReview();
      this.isEditing = false;
    } catch (error) {
      console.log(error);
    } finally {
      this.isLoading = false;
    }
  }

  get currentUserReview() {
    return this.reviewedRecipe.reviews.find(
      review => review.author.slug === this.user.slug,
    );
  }

  private resetReview(): void {
    this.review = new Review({
      text: '',
      score: 5,
      author: this.user,
    });
  }

  private addDisplayedReview(): void {
    this.reviewedRecipe.reviews.push(this.review);
  }

  private deleteDisplayedReview(): void {
    const reviewIndex = this.reviewedRecipe.reviews.indexOf(this.review);
    this.reviewedRecipe.reviews.splice(reviewIndex, 1);
  }
}
