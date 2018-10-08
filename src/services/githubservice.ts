/*
A service for making requests to Github's API.
Used in the BattleService.
Uses the UrlService to create the exact URL:s.

The functionality to get the list of repos for a specific user is somewhat complex
since the list from Github is paginated, hence the extra stream juggling.
*/

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { map, concat, flatMap, share, scan, filter, sample } from 'rxjs/operators';

import { UrlService } from './urlservice';
import { GithubRepo, GithubUserFullInfo } from '../types';

@Injectable()
export class GithubService {
  constructor(private http: HttpClient, private urls: UrlService){}
  getUser(id) {
    return this.http.get<GithubUserFullInfo>(this.urls.urlToUser(id))
  }
  private getRepoListSinglePage(id,page=1) {
    return this.http.get<GithubRepo[]>(this.urls.urlToRepoList(id, page), { observe: 'response' }).pipe(
      map( (res) => ({
        repos: res.body,
        pageNumber: page,
        isLast: !(res.headers.get("link") || '').match(/rel=["']last["']/)
      })
    ));
  }
  private getRepoListPageStream(id,page=1): Observable<PageResponse> {
    return this.getRepoListSinglePage(id, page).pipe(
      flatMap((page)=>{
        let ret = of(page);
        if(!page.isLast){
          return ret.pipe(concat( this.getRepoListPageStream(id, page.pageNumber+1 ) ));
        }
        return ret;
      }),
      share()
    );
  }
  getRepos(userId){
    let page$ = this.getRepoListPageStream(userId);
    let all$ = page$.pipe(
      map(val=>val.repos),
      scan((acc, val)=> (acc||[]).concat(val))
    );
    let last$ = page$.pipe(filter(val => val.isLast));
    return all$.pipe(sample(last$));
  }
}

interface PageResponse {
  repos: GithubRepo[]
  pageNumber: number
  isLast: boolean
}