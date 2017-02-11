import 'zone.js';
import 'reflect-metadata';

import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppComponent } from './app';
import { UrlService } from './services/urlservice';
import { GithubService } from './services/githubservice';
import { BattleService } from './services/battleservice';
import { AuthService } from './services/authservice';

@NgModule({
    imports: [ BrowserModule, HttpModule, FormsModule ],
    declarations: [ AppComponent ],
    bootstrap: [ AppComponent ],
    providers: [ UrlService, GithubService, BattleService, AuthService ]
})
class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
