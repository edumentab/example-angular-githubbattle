/*
The Combatant component, responsible for rendering a single combatant.
Rendered by the Battle component.

The combatant component has a form where the user can load data for a Github user.
If a user is loaded it will display that data through a CombatantDetail component,
and output the startcount to the parent.
*/

import { Component, Output, EventEmitter } from '@angular/core';

import { BattleService } from '../services/battleservice';

import { CombatantInfo } from '../types';

type CombatantMode = 'empty' | 'loading' | 'error' | 'data';

@Component({
  selector: 'combatant',
  template: `
    <input class="qa-github-input" placeholder="Github user name" [(ngModel)]="field" (keyup.enter)="loadData()">
    <button class="qa-load-button" (click)="loadData()" [disabled]="!canLoad">Load</button>
    <div *ngIf="mode === 'loading'" class="qa-load-indicator">...loading...</div>
    <div *ngIf="mode === 'error'" class="qa-error-indicator">Oh no, something wen't wrong :(</div>
    <combatantdetail *ngIf="mode === 'data'" [data]="data"></combatantdetail>
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
  mode: CombatantMode = 'empty'
  field = ""
  data: CombatantInfo = null
  @Output() stars = new EventEmitter<any>()
  constructor(private battleService: BattleService){}
  get canLoad() {
    return this.field && this.mode != 'loading';
  }
  loadData() {
    if (this.canLoad){
      this.mode = 'loading';
      this.stars.emit(null);
      this.battleService.battleInfoForUser(this.field).subscribe(
        data => {
          this.data = data;
          this.mode = 'data';
          this.stars.emit(data.repos.stars);
          this.field = '';
        },
        error => {
          this.mode = 'error';
          this.stars.emit(null);
        }
      );
    }
  }
}
