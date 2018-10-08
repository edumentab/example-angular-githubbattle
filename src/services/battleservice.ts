/*
A service for getting data for a Github user.
Used in the Combatant component.
Uses GithubService to make the requests.

This service acts as a gobetween between that and the Combatant,
packaging up the data in the desired format.
*/

import { Injectable } from '@angular/core';

import { GithubService } from './githubservice';

import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import { CombatantInfo, GithubRepo, CombatantRepoInfo } from '../types';

@Injectable()
export class BattleService {
  cache = {}
  constructor(private githubService: GithubService){}
  battleInfoForUser(id): Observable<CombatantInfo>{
    if (!this.cache[id]){
      let user$ = this.githubService.getUser(id);
      let repo$ = this.githubService.getRepos(id);
      return forkJoin(user$, repo$).pipe(map( ([user,list]) => {
        return ( this.cache[id] = ({id,user,repos:this.digestRepoList(list)}) );
      }));
    } else {
      return of(this.cache[id]);
    }
  }
  private digestRepoList(list: GithubRepo[]){
    return list.reduce((mem, repo) => {
      mem.forks += repo.forks_count;
      mem.stars += repo.stargazers_count;
      mem.watchers += repo.watchers_count;
      mem.languages[repo.language] = (mem.languages[repo.language] || 0) + 1;
      if (repo.forks_count > mem.mostForked.forks_count){
        mem.mostForked = repo;
      }
      if (repo.stargazers_count > mem.mostStarred.stargazers_count){
        mem.mostStarred = repo;
      }
      if (repo.watchers_count > mem.mostForked.forks_count){
        mem.mostWatched = repo;
      }
      return mem;
    }, {
      repos: list.length,
      forks: 0,
      stars: 0,
      watchers: 0,
      mostStarred: {stargazers_count:0},
      mostWatched: {watchers_count:0},
      mostForked: {forks_count:0},
      languages: {}
    } as CombatantRepoInfo);
  }
}
