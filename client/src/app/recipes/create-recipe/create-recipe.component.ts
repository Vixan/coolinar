import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RecipesService } from '../recipes.service';
import { UsersService } from 'src/app/users/users.service';
import { Recipe } from 'src/app/shared/models/recipe.model';
import { Nutrition } from 'src/app/shared/models/nutrition.model';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import HttpStatusCodes from 'src/app/shared/enums/http-status-codes.enum';
import { User } from 'src/app/shared/models/user.model';
import { NzMessageService } from 'ng-zorro-antd';
import { DynamicListElement } from 'src/app/shared/utils/dynamic-list-element';

@Component({
  selector: 'app-create-recipe',
  templateUrl: './create-recipe.component.html',
  styleUrls: ['./create-recipe.component.css'],
})
export class CreateRecipeComponent implements OnInit {
  @ViewChild('ingredientInputElement') ingredientInputElement: ElementRef;
  @ViewChild('directionInputElement') directionInputElement: ElementRef;
  @ViewChild('categoryInputElement') categoryInputElement: ElementRef;
  @ViewChild('imageUrlInputElement') imageUrlInputElement: ElementRef;
  title = '';
  description = '';
  notes = '';
  ingredients = new DynamicListElement();
  directions = new DynamicListElement();
  categories = new DynamicListElement();
  imageUrls = new DynamicListElement();
  preparationTime = 0;
  cookingTime = 0;
  servings = 1;
  nutrition = new Nutrition();
  user: User;

  constructor(
    private readonly titleService: Title,
    private readonly router: Router,
    private readonly recipesService: RecipesService,
    private readonly usersService: UsersService,
    private readonly messageService: NzMessageService,
  ) {}

  ngOnInit() {
    this.initUser();
    this.titleService.setTitle('Create a new recipe');
    this.initInputElementsRef();
  }

  async createRecipe() {
    const recipe = new Recipe({
      title: this.title,
      description: this.description,
      notes: this.notes,
      ingredients: this.ingredients.values,
      directions: this.directions.values,
      categories: this.categories.values,
      imageUrls: this.imageUrls.values,
      preparationTime: this.preparationTime,
      cookingTime: this.cookingTime,
      servings: this.servings,
      nutrition: this.nutrition,
      author: this.user.slug,
    });

    try {
      await this.recipesService.create(recipe);
      this.router.navigate(['/']);
    } catch (error) {
      console.log(error);
      if (error.statusCode === HttpStatusCodes.UNAUTHORIZED) {
        this.router.navigate(['/login']);
      }

      if (error.statusCode === HttpStatusCodes.BAD_REQUEST) {
        this.messageService.create(
          'error',
          Object.values(error.message.errors)[0][0],
        );
      }
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

  initInputElementsRef() {
    this.categories.inputElement = this.categoryInputElement;
    this.ingredients.inputElement = this.ingredientInputElement;
    this.directions.inputElement = this.directionInputElement;
    this.imageUrls.inputElement = this.imageUrlInputElement;
  }

  private async initUser(): Promise<void> {
    try {
      const user = await this.usersService.getFromToken();
      this.user = user;
    } catch (error) {
      console.log(error);
    }
  }
}
