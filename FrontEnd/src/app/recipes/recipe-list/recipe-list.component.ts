import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import * as fromApp from '../../store/app.reducer';
import { map } from 'rxjs/operators';
import { CommonService } from 'src/app/shared/common.service';
import * as RecipeActions from '../store/recipe.actions';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  subscription: Subscription;

  constructor(private recipeService: RecipeService,
              private commonService: CommonService,
              private router: Router,
              private route: ActivatedRoute,
              private store: Store<fromApp.AppState>) {
  }

  ngOnInit() {
    
    // this.subscription = this.recipeService.recipesChanged
    //   .subscribe(
    //     (recipes: Recipe[]) => {
    //       this.recipes = recipes;
    //     }, error => {
    //       console.log(error);
    //     }
    //   );
    // this.commonService.fetchRecipes()
    // .subscribe((recipes: Recipe[])=> {
    //   this.recipeService.setRecipe(recipes);
    // })
    console.log("ONINIT")
    this.store.dispatch(new RecipeActions.FetchRecipes());

    this.subscription = this.store.select('recipe').
    pipe(map(recipes => recipes.recipes)).
    subscribe(
      (recipes: Recipe[]) => {
        this.recipes = recipes;
      }, error => {
        console.log(error);
      }
    );
  }

  onNewRecipe() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }
}
