import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import * as fromAppReducer from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.action';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})

export class HeaderComponent implements OnInit, OnDestroy {
  userSub: Subscription;
  isAuthenticated: boolean = false;
  constructor(private authService: AuthService,
    private store: Store<fromAppReducer.AppState>) { }

  ngOnInit() {
    this.userSub = this.store.select('auth').pipe(map(user => {
      return user.user;
    })).subscribe(user => {
      this.isAuthenticated = !!user;
    })
  }

  onLogout() {
    this.store.dispatch(new AuthActions.LogoutAction());
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
