import { NgModule } from '@angular/core';

import { UrlService } from './urlservice';
import { GithubService } from './githubservice';
import { BattleService } from './battleservice';
import { AuthService } from './authservice';

@NgModule({
  providers: [ UrlService, GithubService, BattleService, AuthService ]
})
export class ServiceModule {}
