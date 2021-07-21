import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { Recipe } from '../recipe.model';
// import { RecipeService } from '../recipe.service';
import * as fromApp from '../../store/app.reducer';
import * as RecipeActions from '../store/recipe.actions';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.action';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(
    // private recipeService: RecipeService,
      private route: ActivatedRoute,
      private router: Router,
      private store: Store<fromApp.AppState>) {
  }

  ngOnInit() {
    this.route.params.pipe(map(
        (params) => {
          return +params['id'];
          // this.recipe = this.recipeService.getRecipe(this.id);
        }), switchMap((id:number) => {
          this.id = id;
          return this.store.select('recipe');
        }), map(
          (recipeState => recipeState.recipes.find((recipe, index) => {
            return index === this.id;
          })
        ))
      ).subscribe((recipe: Recipe) => {
        this.recipe = recipe;
      })
    // this.recipeService.recipesChanged.subscribe(
    //   (recipes: Recipe[]) => {
    //     this.recipe = this.recipeService.getRecipe(this.id);
    //   }
    // )
  }

  onAddToShoppingList() {
    // this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
    this.store.dispatch(new ShoppingListActions.AddMultipleIngredient(this.recipe.ingredients));
  }

  onEditRecipe() {
    this.router.navigate(['edit'], {relativeTo: this.route});
    // this.router.navigate(['../', this.id, 'edit'], {relativeTo: this.route});
  }

  onDeleteRecipe() {
    // this.recipeService.deleteRecipe(this.id);
    // this.router.navigate(['/recipes']);
    this.store.dispatch(new RecipeActions.DeleteRecipe(this.recipe.recipe_id));
  }

}
