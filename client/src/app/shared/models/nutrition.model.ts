export class Nutrition {
  calories = 0;
  fat = 0;
  carbohydrates = 0;
  protein = 0;
  fibre = 0;
  sodium = 0;

  constructor(props?: any) {
    Object.assign(this, props);
  }
}
