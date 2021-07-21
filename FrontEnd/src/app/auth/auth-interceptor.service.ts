import { HttpInterceptor, HttpRequest, HttpHandler, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { take, exhaustMap, map } from "rxjs/operators";
import { Store } from "@ngrx/store";

import * as fromAppReducer from '../store/app.reducer';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor{
    constructor(private authService: AuthService,
        private store: Store<fromAppReducer.AppState>) {}
    intercept(req: HttpRequest<any>, next: HttpHandler){
        return this.store.select('auth').pipe(take(1), map(stateUser => {
            return stateUser.user;
        }), exhaustMap(user => {
            if (!user) {
                return next.handle(req);
            }
            const modifiedReq = req.clone({headers: new HttpHeaders().set('auth', user.token)});
            return next.handle(modifiedReq);
        }))
    }
}