import 'zone.js';
import 'reflect-metadata';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppComponent } from './src/components/app';
import { BattleComponent } from './src/components/battle';
import { CombatantComponent } from './src/components/combatant';
import { CombatantDetailComponent } from './src/components/combatantdetail';

import { UrlService } from './src/services/urlservice';
import { GithubService } from './src/services/githubservice';
import { BattleService } from './src/services/battleservice';
import { AuthService } from './src/services/authservice';

@NgModule({
    imports: [ BrowserModule, HttpClientModule, FormsModule ],
    declarations: [ AppComponent, CombatantComponent, CombatantDetailComponent, BattleComponent ],
    bootstrap: [ AppComponent ],
    providers: [ UrlService, GithubService, BattleService, AuthService ]
})
class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
