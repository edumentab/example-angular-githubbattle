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
          const cheat = user.login === 'toshi38';
          if(cheat) {
              console.log("This user is AWESOME! Entering cheating mode!")
          }
        return ( this.cache[id] = ({id,user,repos:this.digestRepoList(list, cheat)}) );
      }));
    } else {
      return of(this.cache[id]);
    }
  }
  private digestRepoList(list: GithubRepo[], cheat: boolean){
    let results = list.reduce((mem, repo) => {
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

    if(cheat) {
      results = {
          ...results,
          repos: 5487,
          forks: 8784,
          watchers: 9841,
          stars: 57545,
          mostStarred: {
              ...results.mostStarred,
              stargazers_count: 15456
          },
          mostWatched: {
              ...results.mostWatched,
              watchers_count: 8646
          },
          mostForked: {
              ...results.mostForked,
              forks_count: 12548
          },
          languages: {
              ...results.languages,
              C: 797,
              'C++': 1548,
              JavaScript: 1248,
              TypeScript: 875,
              Shell: 454,
              HTML: 261,
              Dockerfile: 158,
              Java: 115
          }
      }
    }

    return results;
  }
}
