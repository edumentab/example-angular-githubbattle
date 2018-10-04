/*
The top-level component of the application.

Responsible for the login functionality, and showing the Battle component
when the user is logged in.
*/

import { Component, NgZone } from '@angular/core';

import { AuthService } from '../services/authservice';

@Component({
  selector: 'app',
  template: `
    <h2>Github battle</h2>
    <div *ngIf="!loginName">
      You have to <button (click)="logIn()">log in</button>, otherwise Github's API limits won't let us have enough fun!
    </div>
    <div *ngIf="error">
      Something went wrong :(
    </div>
    <div *ngIf="loginName">
      Logged in as {{loginName}}.
      <hr/>
      <battle></battle>
    </div>
  `
})
export class AppComponent {
  plrs = ["FOO",null,null]
  error = null;
  loginName: string
  constructor(private authService: AuthService, private zone: NgZone){
    authService.listenToAuthChanges((auth)=>{
      zone.run(() => { // hack to fix Zones not registering Websocket stuff reliably
        this.error = auth.error;
        if (auth.token){
          this.loginName = auth.user.displayName || auth.user.uid;
        }
      })
    });
  }
  logIn() {
    this.authService.signInWithPopup();
  }
}
