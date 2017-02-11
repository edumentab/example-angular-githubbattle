import { Component, NgZone } from '@angular/core';

import { Http } from '@angular/http';
import { BattleService } from './services/battleservice';
import { AuthService } from './services/authservice';
import { GithubService } from './services/githubservice';

@Component({
  selector: 'app',
  template: `
    <h4>Github battle</h4>
    <div *ngIf="!loginName">
      <button (click)="logIn()">Log in</button>
    </div>
    <div *ngIf="loginName">
      Logged in! {{loginName}}
      <hr/>
      <input [(ngModel)]="plr1"> VS <input [(ngModel)]="plr2"> <button (click)="getData()">Calculate</button>
      <hr/>
      <div *ngIf="battle">
        <div>{{battle.player1.name}} has {{battle.player1.repos.stars}} stars across {{battle.player1.repos.repos}} repos.</div>
        <div>{{battle.player2.name}} has {{battle.player2.repos.stars}} stars across {{battle.player2.repos.repos}} repos.</div>
      </div>
    </div>
  `
})
export class AppComponent {
  plr1: string
  plr2: string
  loginName: string
  battle: any
  constructor(private battleService: BattleService, private authService: AuthService, private http: Http, private zone: NgZone){
    authService.listenToAuthChanges((auth)=>{
      zone.run(() => {
        if (auth.token){
          this.loginName = auth.user.displayName || auth.user.uid;
          console.log("Logged in!")
        }
      })
    });
  }
  getData() {
    this.battleService.battleBetween(this.plr1,this.plr2).subscribe(data=>{
      this.battle = data;
    });
  }
  logIn() {
    this.authService.signInWithPopup();
  }
}
