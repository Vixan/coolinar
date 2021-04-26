import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeReviewsComponent } from './review-recipe/recipe-reviews.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [RecipeReviewsComponent],
  imports: [CommonModule, NgZorroAntdModule, FormsModule, ReactiveFormsModule],
  exports: [RecipeReviewsComponent],
})
export class ReviewsModule {}
