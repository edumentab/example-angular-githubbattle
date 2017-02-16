import { Component, Output, EventEmitter } from '@angular/core';

import { Http } from '@angular/http';
import { BattleService } from '../services/battleservice';

@Component({
  selector: 'combatant',
  template: `
    <div [class.winner]="winner">
      <input placeholder="Github user name" [(ngModel)]="field" (keyup.enter)="getData()">
      <button (click)="getData()" [disabled]="!canLoad()">Load</button>
      <div *ngIf="mode === 'loading'">...loading...</div>
      <div *ngIf="mode === 'data'">
        <p>
          <a href="http://github.com/{{data.id}}" target="_blank">{{data.id}}</a> has {{data.repos.stars}} stars across
          {{data.repos.repos}} repos.
          <span *ngIf="data.repos.mostStarred.name">
            The most popular repo is <a href="http://github.com/{{data.id}}/{{data.repos.mostStarred.name}}" target="_blank">
            {{data.repos.mostStarred.name}}</a> with {{data.repos.mostStarred.stargazers_count}} stars.
          </span>
        </p>
        <div *ngIf="data.repos.repos">
          <p>Here's a language breakdown:</p>
          <table>
            <thead><tr><th>Language</th><th>Count</th></tr></thead>
            <tbody>
              <tr *ngFor="let lang of languageKeys">
                <td>{{lang}}</td><td>{{data.repos.languages[lang]}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      width: 300px;
      display: block;
      padding: 5px;
    }
  `]
})
export class CombatantComponent {
  mode = "empty"
  field = ""
  data = null
  @Output() stars = new EventEmitter<any>()
  constructor(private battleService: BattleService, private http: Http){}
  canLoad() {
    return this.field && this.mode != 'loading';
  }
  get languageKeys(){
    let count = this.data.repos.languages;
    return Object.keys(count).sort((l1,l2)=> count[l1] > count[l2] ? -1 : 1 );
  }
  getData() {
    if (this.canLoad()){
      this.mode = "loading";
      this.stars.emit(null);
      this.battleService.battleInfoForUser(this.field).subscribe(data=>{
        this.data = data;
        this.mode = "data";
        this.stars.emit(data.repos.stars);
      });
    }
  }
}
