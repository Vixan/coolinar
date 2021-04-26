import { Recipe } from './recipe.model';

export class User {
  name: string;
  slug: string;
  email: string;
  favoriteRecipes: Recipe[];

  constructor(props: any) {
    Object.assign(this, props);
  }
}
