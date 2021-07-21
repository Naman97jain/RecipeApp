import { User } from "../user.model";
import * as AuthActions from './auth.action';


export interface State {
    user: User,
    errorMessage: any,
    loading: boolean
}

const initialState = {
    user: null,
    errorMessage: null,
    loading: false
}

export function authReducer(state = initialState, action: AuthActions.AuthActions) {

    switch (action.type) {
        case AuthActions.AUTHENTICATION_SUCCESS:
            const user = new User(
                action.payload.email,
                action.payload.token,
                action.payload.expirationDate
            )
            return {
                ...state,
                user: user,
                loading: false,
                errorMessage: null
            }

        case AuthActions.LOGOUT:
            return {
                ...state,
                user: null
            }

        case AuthActions.LOGIN_START:
        case AuthActions.SIGNUP_START:
            return {
                ...state,
                loading: true,
                errorMessage: null
            }
        
        case AuthActions.HANDLE_AUTH_ERROR:
            return {
                ...state,
                loading: false,
                errorMessage: null
            }

        case AuthActions.AUTHENTICATION_FAIL:
            return {
                ...state,
                loading: false,
                errorMessage: action.payload.errorMessage
            }

        default:
            return state;
    }
}