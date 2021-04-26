import { Component, OnInit } from '@angular/core';
import { RecipesService } from '../recipes.service';
import { Recipe } from 'src/app/shared/models/recipe.model';
import { PaginationOptions } from 'src/app/pagination/pagination-options.interface';
import { PaginationService } from 'src/app/shared/services/pagination.service';
import { Title } from '@angular/platform-browser';
import { Pagination } from '../../pagination/pagination';

@Component({
  selector: 'app-top-recipes',
  templateUrl: './top-recipes.component.html',
  styleUrls: ['./top-recipes.component.css'],
})
export class TopRecipesComponent implements OnInit {
  recipes = new Pagination<Recipe>();
  paginationOptions: PaginationOptions;
  loading = false;

  constructor(
    private readonly titleService: Title,
    private readonly recipesService: RecipesService,
    private readonly paginationService: PaginationService,
  ) {}

  ngOnInit() {
    this.titleService.setTitle('Top rated recipes');
    this.paginationOptions = this.paginationService.options;
    this.initRecipes();
  }

  private async initRecipes(): Promise<void> {
    this.loading = true;

    try {
      const paginationResult = await this.recipesService.getTopRated(
        this.paginationService.toZeroIndexed(this.paginationOptions),
      );
      this.recipes = paginationResult;
      this.loading = false;
    } catch (error) {
      console.log(error);
    }
  }
}
