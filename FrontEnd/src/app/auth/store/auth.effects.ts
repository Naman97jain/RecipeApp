import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects'
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { User } from '../user.model';

import * as AuthActions from './auth.action';

export interface AuthResponse {
    email: string,
    token: string,
    expiresIn: string
}

const handleAuthentication = (email: string, token: string, expiresIn: number) => {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000)
    const user = new User(email, token, expirationDate);
    localStorage.setItem("userData", JSON.stringify(user));
    // this.user.next(user);
    return new AuthActions.AuthenticationSuccess(
        {
            email: email,
            token: token,
            expirationDate: expirationDate,
            redirect: true
        })
    // this.autologout(expiresIn * 1000);
}

const errorHandler = (errorRes: any) => {
    let errorMessage = "An unknown error may have occurred!";
    // console.log("Error Response: ", errorRes);
    if (!errorRes) {
        return of(new AuthActions.AuthenticationFail({ errorMessage: errorMessage }));
    }
    return of(new AuthActions.AuthenticationFail({ errorMessage: errorRes }));
}

@Injectable()
export class AuthEffects {
    constructor(private actions$: Actions,
        private http: HttpClient,
        private router: Router,
        private authService: AuthService) { }

    @Effect()
    authLogin = this.actions$.pipe(
        ofType(AuthActions.LOGIN_START),
        switchMap((authData: AuthActions.LoginStartAction) => {
            return this.http.post<AuthResponse>
                ("http://localhost:2000/api/login",
                    { "email": authData.payload.email, "password": authData.payload.password }
                ).pipe(
                    tap((resData: AuthResponse) => {
                        this.authService.setLogoutTimer(+resData.expiresIn * 1000);
                    }), map((resData: AuthResponse) => {
                        return handleAuthentication(resData.email, resData.token, +resData.expiresIn);
                    }), catchError(error => {
                        return errorHandler(error);
                    }
                    ))
        }))

    @Effect()
    authSignup = this.actions$.pipe(
        ofType(AuthActions.SIGNUP_START),
        switchMap((authData: AuthActions.SignupStart) => {
            return this.http.post<AuthResponse>
                ("http://localhost:2000/api/signup",
                    {
                        "email": authData.payload.email,
                        "password": authData.payload.password
                    })
                .pipe(
                    catchError((error) => {
                        return errorHandler(error)
                    }), tap((resData: AuthResponse) => {
                        this.authService.setLogoutTimer(+resData.expiresIn * 1000);
                    }), map((resData: AuthResponse) => {
                        return handleAuthentication(
                            resData.email,
                            resData.token,
                            +resData.expiresIn
                        )
                    }));
        })
    )

    @Effect()
    autoLogin = this.actions$.pipe(
        ofType(AuthActions.AUTO_LOGIN),
        map(() => {
            const userData: {
                email: string; _token: string; _tokenExpirationDate: string
            } = JSON.parse(localStorage.getItem("userData"));

            if (!userData) {
                return { type: "DUMMY" };
            }
            const loadedUser = new User(userData.email, userData._token, new Date(userData._tokenExpirationDate));

            if (loadedUser.token) {
                const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()
                // this.user.next(loadedUser);
                this.authService.setLogoutTimer(expirationDuration);
                return new AuthActions.AuthenticationSuccess({
                    email: loadedUser.email,
                    token: loadedUser.token,
                    expirationDate: new Date(userData._tokenExpirationDate),
                    redirect: false
                })
            }
            return { type: "DUMMY" };
        })
    )

    @Effect({ dispatch: false })
    authSuccess = this.actions$.pipe(
        ofType(AuthActions.AUTHENTICATION_SUCCESS),
        tap((authSuccessData: AuthActions.AuthenticationSuccess) => {
            if (authSuccessData.payload.redirect) {
                this.router.navigate(["/"]);
            }
        })
    );

    @Effect({ dispatch: false })
    authLogout = this.actions$.pipe(
        ofType(AuthActions.LOGOUT),
        tap(() => {
            localStorage.removeItem("userData");
            this.authService.clearLogoutTimer();
            this.router.navigate(["/auth"]);
        })
    );

}