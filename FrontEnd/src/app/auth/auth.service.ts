import { Injectable } from "@angular/core";
// import { Router } from "@angular/router";
// import { HttpClient, HttpErrorResponse } from "@angular/common/http";
// import { catchError, tap } from "rxjs/operators";
// import { throwError, BehaviorSubject } from "rxjs";
// import { Observable } from "rxjs/observable";
import { Store } from "@ngrx/store";

// import { User } from "./user.model";
import * as fromAppReducer from '../store/app.reducer';
import * as fromAuthActions from './store/auth.action';

export interface AuthResponse {
    email: string,
    token: string,
    expiresIn: string
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    tokenExpirationTimer: any;
    // user = new BehaviorSubject<User>(null);
    constructor(
        // private http: HttpClient, 
        // private router: Router, 
        private store: Store<fromAppReducer.AppState>) { }

    
    // signUp(email: string, password: string): Observable<AuthResponse> {
    //     return this.http.post<AuthResponse>
    //         ("http://localhost:2000/api/signup", { "email": email, "password": password })
    //         .pipe(
    //             catchError(this.handler), tap(resData => {
    //                 this.handleAuthentication(
    //                     resData.email,
    //                     resData.token,
    //                     +resData.expiresIn
    //                 )
    //             }));
    // }

    // login(email: string, password: string): Observable<AuthResponse> {
    //     return this.http.post<AuthResponse>
    //         ("http://localhost:2000/api/login", { "email": email, "password": password })
    //         .pipe(catchError(this.handler), tap(resData => {
    //             this.handleAuthentication(
    //                 resData.email,
    //                 resData.token,
    //                 +resData.expiresIn
    //             )
    //         }));
    // }

    // logout() {
    //     // this.user.next(null);
    //     this.store.dispatch(new fromAuthActions.LogoutAction());
    //     // this.router.navigate(["/auth"]);
    //     // localStorage.removeItem("userData");
    // }

    // autologout(tokenExpirationTimer: number) {
    //     this.tokenExpirationTimer = setTimeout(() => {
    //         this.logout();
    //     }, tokenExpirationTimer)
    // }

    
    setLogoutTimer(tokenExpirationTimer: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.store.dispatch(new fromAuthActions.LogoutAction());
        }, tokenExpirationTimer)
    }

    clearLogoutTimer() {
        if (this.tokenExpirationTimer){
        clearTimeout(this.tokenExpirationTimer);
        this.tokenExpirationTimer = null;
    }
}

    // autologin() {
    //     const userData: {
    //         email: string; _token: string; _tokenExpirationDate: string
    //     } = JSON.parse(localStorage.getItem("userData"));

    //     if (!userData) {
    //         return;
    //     }
    //     const loadedUser = new User(userData.email, userData._token, new Date(userData._tokenExpirationDate));

    //     if (loadedUser.token) {
    //         const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()
    //         // this.user.next(loadedUser);
    //         this.store.dispatch(new fromAuthActions.AuthenticationSuccess({
    //             email: loadedUser.email,
    //             token: loadedUser.token,
    //             expirationDate: new Date(userData._tokenExpirationDate)    
    //         }
    //             ));
    //         this.autologout(expirationDuration);
    //     }
    // }

    // private handleAuthentication(email: string, token: string, expiresIn: number) {
    //     const expirationDate = new Date(new Date().getTime() + expiresIn * 1000)
    //     const user = new User(email, token, expirationDate);
    //     // this.user.next(user);
    //     this.store.dispatch(new fromAuthActions.AuthenticationSuccess(
    //         {
    //             email: email, 
    //             token: token, 
    //             expirationDate: expirationDate
    //         }));
    //     this.autologout(expiresIn * 1000);
    //     localStorage.setItem("userData", JSON.stringify(user));
    // }

    // private handler(errorRes: HttpErrorResponse) {
    //     let errorMessage = "An unknown error may have occurred!";
    //     // console.log("Error Response: ", errorRes);
    //     if (!errorRes) {
    //         return throwError(errorMessage);
    //     }
    //     return throwError(errorRes.error);
    // }
}