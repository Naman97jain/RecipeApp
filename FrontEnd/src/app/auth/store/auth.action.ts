import { Action } from "@ngrx/store";

export const LOGIN_START = '[Auth] Login Start';
export const AUTHENTICATION_SUCCESS = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const AUTHENTICATION_FAIL = '[Auth] Authentication Fail';
export const SIGNUP_START = '[Auth] Signup Start';
export const HANDLE_AUTH_ERROR = '[Auth] Handle Auth Error';
export const AUTO_LOGIN = '[Auth] Auto Login';

export class AuthenticationSuccess implements Action {
    readonly type = AUTHENTICATION_SUCCESS;

    constructor(
        public payload: {
            email: string;
            token: string;
            expirationDate: Date,
            redirect: boolean
        }
    ) { }
}

export class LogoutAction implements Action {
    readonly type = LOGOUT;
    constructor() { };
}

export class LoginStartAction implements Action {
    readonly type = LOGIN_START;
    constructor(public payload: {
        email: string;
        password: string;
    }) { }
}

export class AuthenticationFail implements Action {
    readonly type = AUTHENTICATION_FAIL;
    constructor(public payload: { errorMessage: any }) { }
}

export class SignupStart implements Action {
    readonly type = SIGNUP_START;
    constructor(public payload: { email: string; password: string; }) { }
}

export class HandleAuthError implements Action {
    readonly type = HANDLE_AUTH_ERROR;
    constructor(){}
}

export class AutoLogin implements Action {
    readonly type = AUTO_LOGIN;
    constructor() {}
}

export type AuthActions = AuthenticationSuccess
    | LogoutAction
    | LoginStartAction
    | AuthenticationFail
    | SignupStart
    | HandleAuthError
    | AutoLogin;