import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app';
import { BattleComponent } from './battle';
import { CombatantComponent } from './combatant';
import { CombatantDetailComponent } from './combatantdetail';

@NgModule({
    imports: [BrowserModule, HttpClientModule, FormsModule, CommonModule],
    declarations: [ AppComponent, CombatantComponent, CombatantDetailComponent, BattleComponent ],
    bootstrap: [ AppComponent ],
})
export class ComponentModule {}