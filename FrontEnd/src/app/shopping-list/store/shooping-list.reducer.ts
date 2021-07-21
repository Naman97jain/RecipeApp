import { Ingredient } from "src/app/shared/ingredient.model";
import * as ShoppingListActions from './shopping-list.action';

export interface State {
    ingredients: Ingredient[],
    editedItem: Ingredient,
    editedItemIndex: number
}

const initialState : State = {
    ingredients: [
        new Ingredient('Apple', 10), 
        new Ingredient('Orange', 5)
    ],
    editedItem : null,
    editedItemIndex: -1
};

export function shoppingListReducer(
    state = initialState, 
    action: ShoppingListActions.ShoppingListActions) {
    switch(action.type) {
        case ShoppingListActions.ADD_INGREDIENT:
            return {
                ...state,
                ingredients: [...state.ingredients, action.payload]
            }
        case ShoppingListActions.ADD_MULTIPLE_INGREDIENT:
            return {
                ...state,
                ingredients: [...state.ingredients, ...action.payload]
            }
        case ShoppingListActions.UPDATE_INGREDIENT:
            const ingredient = state.ingredients[state.editedItemIndex]
            const updatedIngredient = {
                ...ingredient,
                ...action.payload.ingredient
            }
            const updatedIngredients = [...state.ingredients];
            updatedIngredients[state.editedItemIndex] = updatedIngredient;

            return {
                ...state,
                ingredients: updatedIngredients,
                editedItemIndex: -1,
                editedItem: null
            }
        
        case ShoppingListActions.DELETE_INGREDIENT:
            const modified_ingredients = state.ingredients.filter((ing, ingIndex)=>{
                return ingIndex !== state.editedItemIndex;
            });
            return {
                ...state,
                ingredients : modified_ingredients,
                editedItemIndex: -1,
                editedItem: null
            }

        case ShoppingListActions.START_EDIT:
            return {
                ...state,
                editedItemIndex: action.payload.index,
                editedItem : {...state.ingredients[action.payload.index]}
            }

        case ShoppingListActions.STOP_EDIT:
            return {
                ...state,
                editedItem: null,
                editedItemIndex: -1
            }
        default:
            return state;
    }
}