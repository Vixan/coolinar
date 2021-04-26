import { Nutrition } from './nutrition.model';
import { Review } from './review.model';
import { User } from './user.model';

export class Recipe {
  slug: string;
  title: string;
  categories: string[];
  description: string;
  ingredients: string[];
  directions: string[];
  preparationTime: number;
  cookingTime: number;
  servings: number;
  notes: string;
  nutrition: Nutrition;
  reviews: Review[];
  averageReviewScore: number;
  imageIrls: string[];
  author: User;
  dateCreated: Date;
  dateUpdated: Date;

  constructor(props: any) {
    Object.assign(this, props);
  }
}
