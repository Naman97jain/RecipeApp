import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';

import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import * as ShoppingListActions from '../shopping-list/store/shopping-list.action';
import * as fromAppReducer from '../store/app.reducer';
import { CommonService } from '../shared/common.service';


@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [];

  constructor(private slService: ShoppingListService,
    private commonService: CommonService,
    private store: Store<fromAppReducer.AppState>) {}

  setRecipe(recipes: Recipe[]){
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  } 

  getRecipeId(index: number){
    return this.recipes[index]["recipe_id"];
  }

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    // this.slService.addIngredients(ingredients);
    this.store.dispatch(new ShoppingListActions.AddMultipleIngredient(ingredients));
  }

  deleteRecipe(index: number) {
    // this.recipes.splice(index, 1);
    // this.recipesChanged.next(this.recipes.slice());
    this.commonService.deleteRecipe(this.recipes[index]["recipe_id"]);
  }
}
