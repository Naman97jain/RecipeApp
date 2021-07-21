import { Component, OnInit, ComponentFactoryResolver, ViewChild, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { Observable } from "rxjs/Observable";
import { Store } from "@ngrx/store";
import { FormControl, FormGroup, Validators} from "@angular/forms";

import { AuthService, AuthResponse } from "./auth.service";
import { User } from "./user.model";
import { AlertComponent } from "../shared/alert/alert.component";
import { PlaceholderDirective } from "../shared/placeholder/placeholder.directive";
import * as fromAppReducer from '../store/app.reducer';
import * as AuthActions from './store/auth.action';
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";

@Component({
    'selector': 'app-auth',
    'templateUrl': './auth.component.html',
})
export class AuthComponent implements OnInit, OnDestroy{
    isLogInMode = false;
    isLoading : boolean;
    error: string = null;
    signUpForm : FormGroup;
    user: User = null;
    closeSub: Subscription;
    actionSub: Subscription;

    @ViewChild(PlaceholderDirective) alerthost: PlaceholderDirective;
    constructor(
        // private authService: AuthService, 
        // private router: Router, 
        private componentFactoryResolver: ComponentFactoryResolver,
        private store: Store<fromAppReducer.AppState>) {}

    onSwitch(){
        this.isLogInMode = !this.isLogInMode;
    }
    ngOnInit(){
        this.actionSub = this.store.select('auth').subscribe(authData => {
            this.isLoading = authData.loading;
            this.error = authData.errorMessage;
            if (this.error){
                this.showErrorAlert(this.error);
            }
        });
        this.signUpForm = new FormGroup({
            'email': new FormControl(null, Validators.required),
            'password': new FormControl(null, Validators.required)
          });
    }

    onSubmit(){
        let authObs: Observable<AuthResponse>
        const email = this.signUpForm.value["email"];
        const password = this.signUpForm.value["password"];
        this.signUpForm.reset();
        if (this.isLogInMode) {
            this.store.dispatch(new AuthActions.LoginStartAction({email: email, password: password}));
        }
        else {
            this.store.dispatch(new AuthActions.SignupStart({email: email, password: password}));
        }
    }

    onHandleError() {
        this.store.dispatch(new AuthActions.HandleAuthError());
    }

    showErrorAlert(message: string) {
        const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
        const hostViewContainerRef = this.alerthost.viewContainerRef;
        hostViewContainerRef.clear();

        const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);

        componentRef.instance.message = message;
        this.closeSub = componentRef.instance.close.subscribe(() => {
            this.closeSub.unsubscribe();
            hostViewContainerRef.clear();
        })

    }

    ngOnDestroy(){
        if (this.closeSub){
            this.closeSub.unsubscribe();
        }
        this.actionSub.unsubscribe();
    }
}