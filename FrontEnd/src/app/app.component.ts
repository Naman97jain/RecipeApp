import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthService } from './auth/auth.service';
import * as AuthActions from './auth/store/auth.action';

import * as fromAppReducer from './store/app.reducer';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  constructor(
    private authService: AuthService, 
    private store: Store<fromAppReducer.AppState>,
    @Inject(PLATFORM_ID) private platform_id
    ) {}

  ngOnInit(){
    // this.authService.autologin();
    if (isPlatformBrowser(this.platform_id)){
    this.store.dispatch(new AuthActions.AutoLogin());
    }
  }
}
