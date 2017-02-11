import { Injectable } from '@angular/core';

import { GithubService } from './githubservice';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkjoin';
import 'rxjs/add/operator/map';

@Injectable()
export class BattleService {
  constructor(private githubService: GithubService){}
  battleInfoForUser(id){
    let user$ = this.githubService.getUser(id);
    let repo$ = this.githubService.getRepoListPages(id);
    return Observable.forkJoin(user$, repo$).map( ([user,list]) => {
      return ({user,list});
    })
  }
  battleBetween(id1,id2){
    return Observable.forkJoin(
      this.battleInfoForUser(id1),
      this.battleInfoForUser(id2)
    ).map(([plr1,plr2]) => {
      return {
        player1: {
          name: id1,
          user: plr1.user,
          repos: this.digestRepoList(plr1.list)
        },
        player2: {
          name: id2,
          user: plr2.user,
          repos: this.digestRepoList(plr2.list)
        }
      };
    })
  }
  digestRepoList(list){
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
      if (repo.watchers_count > mem.mostForked.watchers_count){
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
    });
  }
}
