import { Component, OnInit, Input, AfterViewInit, OnChanges } from '@angular/core';
import { Recipe } from 'src/app/shared/models/recipe.model';

@Component({
  selector: 'app-recipes-widget',
  templateUrl: './recipes-widget.component.html',
  styleUrls: ['./recipes-widget.component.css'],
})
export class RecipesWidgetComponent implements OnInit, OnChanges {
  @Input()
  recipes: Recipe[] = [];

  @Input()
  title?: string;

  @Input()
  description?: string;

  @Input()
  icon?: string;

  @Input()
  link?: string;

  loading = false;

  constructor() {}

  ngOnInit() {
   this.loading = true;
  }

  ngOnChanges(): void {
    this.loading = false;
  }
}
