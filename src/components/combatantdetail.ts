/*
The CombatantDetail component, responsible for rendering data about an
already loaded combatant.

Rendered by the Combatant component.
*/

import { Component, Input } from '@angular/core';

import { CombatantInfo } from '../types';

@Component({
  selector: 'combatantdetail',
  template: `
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
  `
})
export class CombatantDetailComponent {
  @Input() data: CombatantInfo
  get languageKeys(){
    let count = this.data.repos.languages;
    return Object.keys(count).sort((l1,l2)=> count[l1] > count[l2] ? -1 : 1 );
  }
}
