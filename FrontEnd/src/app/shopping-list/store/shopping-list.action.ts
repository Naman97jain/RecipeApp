import { Action } from "@ngrx/store";
import { Ingredient } from "src/app/shared/ingredient.model";

export const ADD_INGREDIENT = 'ADD_INGREDIENT';
export const ADD_MULTIPLE_INGREDIENT = 'ADD_MULTIPLE_INGREDIENT';
export const UPDATE_INGREDIENT = 'UPDATE_INGREDIENT';
export const DELETE_INGREDIENT = 'DELETE_INGREDIENT';
export const START_EDIT = 'START_EDIT';
export const STOP_EDIT = 'STOP_EDIT';

export class AddIngredient implements Action {
    readonly type = ADD_INGREDIENT;
    constructor(public payload: Ingredient) { }
}

export class AddMultipleIngredient implements Action{
    readonly type = ADD_MULTIPLE_INGREDIENT;
    constructor(public payload: Ingredient[]) { }
}

export class UpdateIngredient implements Action {
    readonly type = UPDATE_INGREDIENT;
    constructor(public payload: {ingredient: Ingredient }) { }
}

export class DeleteIngredient implements Action {
    readonly type = DELETE_INGREDIENT;
    constructor() { }
}

export class StartEdit implements Action {
    readonly type = START_EDIT;
    constructor(public payload : {index: number}) {}
}

export class StopEdit implements Action {
    readonly type = STOP_EDIT;
    constructor () {}
}

export type ShoppingListActions = AddIngredient 
                                | AddMultipleIngredient 
                                | UpdateIngredient 
                                | DeleteIngredient
                                | StartEdit
                                | StopEdit;