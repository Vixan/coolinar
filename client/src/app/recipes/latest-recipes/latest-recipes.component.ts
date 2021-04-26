import { Component, OnInit } from '@angular/core';
import { Recipe } from '../../shared/models/recipe.model';
import { PaginationOptions } from '../../pagination/pagination-options.interface';
import { RecipesService } from '../recipes.service';
import { PaginationService } from '../../shared/services/pagination.service';
import { Title } from '@angular/platform-browser';
import { Pagination } from '../../pagination/pagination';

@Component({
  selector: 'app-latest-recipes',
  templateUrl: './latest-recipes.component.html',
  styleUrls: ['./latest-recipes.component.css'],
})
export class LatestRecipesComponent implements OnInit {
  recipes = new Pagination<Recipe>();
  paginationOptions: PaginationOptions;
  isLoading = false;

  constructor(
    private readonly titleService: Title,
    private readonly recipesService: RecipesService,
    private readonly paginationService: PaginationService,
  ) {}

  ngOnInit() {
    this.titleService.setTitle('Latest recipes');
    this.paginationOptions = this.paginationService.options;
    this.initRecipes();
  }

  private async initRecipes(): Promise<void> {
    this.isLoading = true;

    try {
      const paginationResult = await this.recipesService.getLatest(
        this.paginationService.toZeroIndexed(this.paginationOptions),
      );
      this.recipes = paginationResult;
      this.isLoading = false;
    } catch (error) {
      console.log(error);
    }
  }
}
