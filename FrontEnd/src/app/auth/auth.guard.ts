import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { take, map } from "rxjs/operators";
import { Store } from "@ngrx/store";

import * as fromAppReducer from '../store/app.reducer';


@Injectable({providedIn: "root"})
export class AuthGuard implements CanActivate{
    constructor(private authService: AuthService,
                private router: Router, 
                private store: Store<fromAppReducer.AppState>) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): 
    boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
        return this.store.select('auth').pipe(
            take(1), map(user => {
                const isAuth = !!user.user;
                if (isAuth){
                    return true;
                }
                return this.router.createUrlTree(["/auth"]);
            })
        )
    }
}