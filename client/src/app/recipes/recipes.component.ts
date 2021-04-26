import { Component, OnInit } from '@angular/core';
import { RecipesService } from './recipes.service';
import { Recipe } from '../shared/models/recipe.model';
import { PaginationOptions } from '../pagination/pagination-options.interface';
import { HttpExceptionResponse } from '../shared/interfaces/http-exception-response.interface';
import { Title } from '@angular/platform-browser';
import { Pagination } from "../pagination/pagination";

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
})
export class RecipesComponent implements OnInit {
  topRecipes = new Pagination<Recipe>();
  latestRecipes = new Pagination<Recipe>();
  paginationOptions: PaginationOptions = {
    skip: 0,
    take: 4,
  };

  constructor(
    private readonly titleService: Title,
    private readonly recipesService: RecipesService,
  ) {}

  ngOnInit() {
    this.titleService.setTitle('Coolinar');
    this.initTopRecipes();
    this.initNewestRecipes();
  }

  private async initTopRecipes(): Promise<void> {
    try {
      const paginationResult = await this.recipesService.getTopRated(this.paginationOptions);
      this.topRecipes = paginationResult;
    } catch (error) {
      console.log(error);
    }
  }

  private async initNewestRecipes(): Promise<void>  {
    try {
      const paginationResult = await this.recipesService.getLatest(this.paginationOptions);
      this.latestRecipes = paginationResult;
    } catch (error) {
      console.log(error);
    }
  }
}
