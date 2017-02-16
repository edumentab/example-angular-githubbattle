import { Injectable } from '@angular/core';

import { GithubService } from './githubservice';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkjoin';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

@Injectable()
export class BattleService {
  cache = {}
  constructor(private githubService: GithubService){}
  battleInfoForUser(id){
    if (!this.cache[id]){
      let user$ = this.githubService.getUser(id);
      let repo$ = this.githubService.getRepoListPages(id);
      return Observable.forkJoin(user$, repo$).map( ([user,list]) => {
        return ( this.cache[id] = ({id,user,repos:this.digestRepoList(list)}) );
      })
    } else {
      return Observable.of(this.cache[id]);
    }
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
