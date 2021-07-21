import { Ingredient } from '../shared/ingredient.model';

export class Recipe {
  public recipe_id: string;
  public name: string;
  public description: string;
  public imagePath: string;
  public ingredients: Ingredient[];

  constructor(name: string, desc: string, imagePath: string, ingredients: Ingredient[], recipe_id?: string) {
    this.recipe_id = recipe_id;
    this.name = name;
    this.description = desc;
    this.imagePath = imagePath;
    this.ingredients = ingredients;
  }
}
