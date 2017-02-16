import { Component, NgZone } from '@angular/core';

import { Http } from '@angular/http';
import { AuthService } from '../services/authservice';

@Component({
  selector: 'app',
  template: `
    <h2>Github battle</h2>
    <div *ngIf="!loginName">
      You have to <button (click)="logIn()">log in</button>, otherwise Github's API limits won't let us have enough fun!
    </div>
    <div *ngIf="loginName">
      Logged in as {{loginName}}.
      <hr/>
      <div class="combatants">
        <combatant [class.winner]="winner===1" (stars)="setUser(1,$event)"></combatant>
        <combatant [class.winner]="winner===2" (stars)="setUser(2,$event)"></combatant>
      </div>
    </div>
  `,
  styles: [`
    .combatants {
      display: flex;
      justify-content: space-around;
    }
    .winner {
      background-color: gold;
    }
  `]
})
export class AppComponent {
  plrs = ["FOO",null,null]
  loginName: string
  constructor(private authService: AuthService, private zone: NgZone){
    authService.listenToAuthChanges((auth)=>{
      zone.run(() => { // hack to fix Zones not registering Websocket stuff reliably
        if (auth.token){
          this.loginName = auth.user.displayName || auth.user.uid;
        }
      })
    });
  }
  get winner(){
    let result = this.plrs[1] === null || this.plrs[2] === null ? 0
      : this.plrs[1] === this.plrs[2] ? 0
      : this.plrs[1] > this.plrs[2] ? 1
      : 2;
    return result;
  }
  setUser(plr, data){
    this.plrs[plr] = data;
  }
  logIn() {
    this.authService.signInWithPopup();
  }
}
