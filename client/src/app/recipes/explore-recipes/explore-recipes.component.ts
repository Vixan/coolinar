import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RecipesService } from '../recipes.service';
import { Title } from '@angular/platform-browser';
import { DynamicListElement } from 'src/app/shared/utils/dynamic-list-element';
import { SearchRecipes } from './interfaces/search-recipes';
import { Recipe } from 'src/app/shared/models/recipe.model';
import { PaginationOptions } from 'src/app/pagination/pagination-options.interface';
import { PaginationService } from 'src/app/shared/services/pagination.service';
import { Pagination } from '../../pagination/pagination';

@Component({
  selector: 'app-explore-recipes',
  templateUrl: './explore-recipes.component.html',
  styleUrls: ['./explore-recipes.component.css'],
})
export class ExploreRecipesComponent implements OnInit {
  @ViewChild('ingredientInputElement') ingredientInputElement: ElementRef;
  @ViewChild('categoryInputElement') categoryInputElement: ElementRef;
  recipes = new Pagination<Recipe>();
  title = '';
  ingredients = new DynamicListElement();
  categories = new DynamicListElement();
  paginationOptions: PaginationOptions;
  isLoading = false;

  constructor(
    private readonly titleService: Title,
    private readonly recipesService: RecipesService,
    private readonly paginationService: PaginationService,
  ) {}

  ngOnInit() {
    this.titleService.setTitle('Explore recipes');
    this.paginationOptions = this.paginationService.options;
    this.initInputElementsRef();
  }

  async initRecipes(): Promise<void> {
    this.isLoading = true;

    const search: SearchRecipes = {
      title: this.title,
      ingredients: this.ingredients.values,
      categories: this.categories.values,
    };

    try {
      const paginationResult = await this.recipesService.search(
        this.paginationService.toZeroIndexed(this.paginationOptions),
        search,
      );

      this.recipes = paginationResult;
      this.isLoading = false;
    } catch (error) {
      console.log(error);
    }
  }

  sliceTagName(tag: string): string {
    const isLongTag = tag.length > 20;
    return isLongTag ? `${tag.slice(0, 20)}...` : tag;
  }

  showTagInput(type: string): void {
    this[type].isVisible = true;

    setTimeout(() => {
      this.initInputElementsRef();
      this[type].inputElement.nativeElement.focus();
    }, 10);
  }

  addTag(type: string): void {
    if (
      this[type].inputValue &&
      this[type].values.indexOf(this[type].inputValue) === -1
    ) {
      this[type].values = [...this[type].values, this[type].inputValue];
    }
    this[type].inputValue = '';
    this[type].isVisible = false;
  }

  deleteTag(removedTag: {}, type: string): void {
    this[type].values = this[type].values.filter(tag => tag !== removedTag);
  }

  private initInputElementsRef() {
    this.categories.inputElement = this.categoryInputElement;
    this.ingredients.inputElement = this.ingredientInputElement;
  }
}
