import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { Recipe } from "../recipe.model";
import * as RecipeActions from './recipe.actions';

@Injectable()
export class RecipeEffects {
    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private router: Router
        ){}

    
    @Effect()
    fetchRecipes = this.actions$.pipe(
        ofType(RecipeActions.FETCH_RECIPE),
        switchMap(() => {
            return this.http.get<any>("http://localhost:2000/api/recipe/list")
        }), map(recipes => {
            return recipes.map(recipe => {
                return {
                    ...recipe,
                    ingredients: recipe.ingredients ? recipe.ingredients : []
                }
            })
        }), map(recipes => {
                return new RecipeActions.SetRecipe(recipes);
        }), catchError(error => {
            console.log("Error", error);
            return of({type: "ERROR"});
        })
    )
    
    @Effect()
    addRecipe = this.actions$.pipe(
        ofType(RecipeActions.ADD_RECIPE),
        switchMap((addRecipeAction: RecipeActions.AddRecipe) => {
            return this.http.post("http://localhost:2000/api/recipe/add", addRecipeAction.payload)
            .pipe(map(()=> {
                return new RecipeActions.FetchRecipes();
            })) 
        })
    )

    @Effect()
    updateRecipe = this.actions$.pipe(
        ofType(RecipeActions.UPDATE_RECIPE),
        switchMap((updateRecipeAction: RecipeActions.UpdateRecipe) => {
            return this.http.put("http://localhost:2000/api/recipe/update", updateRecipeAction.payload.newRecipe)
            .pipe(map(() => {
                return new RecipeActions.FetchRecipes();
            }))
        })
    )

    @Effect()
    deleteRecipe = this.actions$.pipe(
        ofType(RecipeActions.DELETE_RECIPE),
        switchMap((deleteRecipeAction: RecipeActions.DeleteRecipe) => {
            return this.http.delete("http://localhost:2000/api/recipe/delete",
            {params: {"recipe_id": deleteRecipeAction.payload}}
        ).pipe(map(() => {
            this.router.navigate(['/recipes']);
            return new RecipeActions.FetchRecipes();
            
        }))
        })
    )
}