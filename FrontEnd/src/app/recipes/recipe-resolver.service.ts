import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Injectable } from "@angular/core";
import { Recipe } from "./recipe.model";
import { Store } from "@ngrx/store";
import {Actions, ofType} from "@ngrx/effects";

// import { CommonService } from "../shared/common.service";
// import { RecipeService } from "./recipe.service";
import * as fromApp from '../store/app.reducer';
import * as RecipeActions from './store/recipe.actions';
import { take } from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class RecipeResolverService implements Resolve<Recipe[]>{
    constructor (
        // private commonService : CommonService, 
        // private recipeService: RecipeService,
        private store: Store<fromApp.AppState>,
        private actions$: Actions

        ) {}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // const recipes = this.recipeService.getRecipes();
        // if (recipes.length === 0){
            // return this.commonService.fetchRecipes();
        // }
        // else{
            // return recipes;
        // }
       this.store.dispatch(new RecipeActions.FetchRecipes());
       return this.actions$.pipe(ofType(RecipeActions.SET_RECIPE), take(1));

    }
}