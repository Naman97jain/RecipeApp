import { Action } from "@ngrx/store";
import { Recipe } from "../recipe.model";

export const SET_RECIPE = "[Recipe] GET RECIPE"
export const ADD_RECIPE = "[Recipe] ADD RECIPE"
export const FETCH_RECIPE = "[Recipe] FETCH RECIPES"
export const GET_RECIPE_BY_ID = "[Recipe] GET RECIPE BY ID"
export const UPDATE_RECIPE = "[Recipe] UPDATE RECIPE"
export const DELETE_RECIPE = "[Recipe] DELETE RECIPE"

export class SetRecipe implements Action{
    readonly type = SET_RECIPE;
    constructor(public payload: Recipe[]){}
}

export class FetchRecipes implements Action {
    readonly type = FETCH_RECIPE;
    constructor(){}
}

export class AddRecipe implements Action {
    readonly type = ADD_RECIPE;
    constructor(public payload: Recipe){}
}

export class GetRecipeById implements Action {
    readonly type = GET_RECIPE_BY_ID;
    constructor(public payload: number) {}
}

export class UpdateRecipe implements Action {
    readonly type = UPDATE_RECIPE;
    constructor(public payload: {newRecipe: Recipe, id: string}) {}
}

export class DeleteRecipe implements Action {
    readonly type = DELETE_RECIPE;
    constructor(public payload: string) {}
}

export type RecipeActions = SetRecipe
                        | AddRecipe
                        | GetRecipeById
                        | FetchRecipes
                        | UpdateRecipe
                        | DeleteRecipe;