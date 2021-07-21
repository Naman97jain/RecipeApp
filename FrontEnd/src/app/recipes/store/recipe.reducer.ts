import { Recipe } from "../recipe.model";
import * as RecipeActions from "./recipe.actions";


export interface State {
    recipes: Recipe[]
}

const initialState: State = {
    recipes : []
}

export function RecipeReducer(state = initialState, action: RecipeActions.RecipeActions) {
    switch(action.type){
        case RecipeActions.SET_RECIPE:
            return {
                ...state,
                recipes: [...action.payload]
            }
        
        case RecipeActions.GET_RECIPE_BY_ID:
            return {
                ...state,
                recipe: {...state.recipes[action.payload]}
            }
        
        default:
            return state;
    }
}