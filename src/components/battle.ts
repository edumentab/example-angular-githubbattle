/*
The Battlefield component, rendered by the App component.

Responsible for rendering two Combatant components, and listening to
their `stars` output in order to highlight the winner.
*/

import { Component } from '@angular/core';

@Component({
  selector: 'battle',
  template: `
    <div class="combatants">
      <combatant [class.winner]="winner===1" (stars)="setUserStars(1, $event)"></combatant>
      <combatant [class.winner]="winner===2" (stars)="setUserStars(2, $event)"></combatant>
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
export class BattleComponent {
  plrs = ["FOO",null,null]
  get winner(){
    let result = this.plrs[1] === null || this.plrs[2] === null ? 0
      : this.plrs[1] === this.plrs[2] ? 0
      : this.plrs[1] > this.plrs[2] ? 1
      : 2;
    return result;
  }
  setUserStars(plr, data){
    this.plrs[plr] = data;
  }
}
