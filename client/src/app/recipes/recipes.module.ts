import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopRecipesComponent } from './top-recipes/top-recipes.component';
import { RecipesComponent } from './recipes.component';
import { RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { RecipeCardComponent } from './recipe-card/recipe-card.component';
import { RecipesWidgetComponent } from './recipes-widget/recipes-widget.component';
import { RecipeDetailsComponent } from './recipe-details/recipe-details.component';
import { ReviewsModule } from '../reviews/reviews.module';
import { CreateRecipeComponent } from './create-recipe/create-recipe.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ExploreRecipesComponent } from './explore-recipes/explore-recipes.component';
import { LatestRecipesComponent } from './latest-recipes/latest-recipes.component';
import { FavoriteRecipesComponent } from './favorite-recipes/favorite-recipes.component';
import { AuthGuardService } from '../auth/auth-guard.service';
import { CreatedRecipesComponent } from './created-recipes/created-recipes.component';

@NgModule({
  declarations: [
    RecipesComponent,
    RecipeCardComponent,
    TopRecipesComponent,
    RecipesWidgetComponent,
    RecipeDetailsComponent,
    CreateRecipeComponent,
    ExploreRecipesComponent,
    LatestRecipesComponent,
    FavoriteRecipesComponent,
    CreatedRecipesComponent,
  ],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    ReviewsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: RecipesComponent,
      },
      {
        path: 'recipes/explore',
        component: ExploreRecipesComponent,
      },
      {
        path: 'recipes/top-rated',
        component: TopRecipesComponent,
      },
      {
        path: 'recipes/latest',
        component: LatestRecipesComponent,
      },
      {
        path: 'recipes/create',
        component: CreateRecipeComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'recipes/favorite',
        component: FavoriteRecipesComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'recipes/authored',
        component: CreatedRecipesComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'recipes/:slug',
        component: RecipeDetailsComponent,
      },
    ]),
  ],
})
export class RecipesModule {}
