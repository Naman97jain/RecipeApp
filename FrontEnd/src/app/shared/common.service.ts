import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { HttpClient, HttpParams } from "@angular/common/http";
import { tap, catchError } from "rxjs/operators";
import { throwError } from "rxjs";

// import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipe.model";
import * as fromAppReducer from '../store/app.reducer';
import * as RecipeActions from '../recipes/store/recipe.actions';

@Injectable({ providedIn: 'root' })
export class CommonService {
    constructor(
        private http: HttpClient,
        private store: Store<fromAppReducer.AppState>,
        // private recipeService: RecipeService
    ) { }

    fetchRecipes() {
        return this.http.get<Recipe[]>("http://localhost:2000/api/recipe/list")
            .pipe(tap(recipes => {
                // this.recipeService.setRecipe(recipes);
                this.store.dispatch(new RecipeActions.SetRecipe(recipes));

            }), catchError(error => {
                return throwError(error);
            }))
    }

    addRecipe(recipe: Recipe) {
        return this.http.post("http://localhost:2000/api/recipe/add", recipe);
        
    }

    updateRecipe(recipe: Recipe) {
        return this.http.put("http://localhost:2000/api/recipe/update", recipe);
    }

    deleteRecipe(recipe_id: string) {
        return this.http.delete("http://localhost:2000/api/recipe/delete",
            {params: {"recipe_id": recipe_id}}
        )
    }
}