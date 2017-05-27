/*
A service for making requests to Github's API.
Used in the BattleService.
Uses the UrlService to create the exact URL:s.

The functionality to get the list of repos for a specific user is somewhat complex
since the list from Github is paginated, hence the extra stream juggling.
*/

import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/concat';
import 'rxjs/add/operator/mergeMap'; // gives us flatMap
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/sample';

import { UrlService } from './urlservice';

@Injectable()
export class GithubService {
  constructor(private http: Http, private urls: UrlService){}
  getUser(id):Observable<any>{
    return this.http.get(this.urls.urlToUser(id))
      .map( (res:Response)=> res.json() || {} );
  }
  private getRepoListSinglePage(id,page=1):Observable<any>{
    return this.http.get(this.urls.urlToUserRepoListPage(id, page))
      .map( (res:Response)=> ({
        repos: res.json(),
        pageNumber: page,
        isLast: !(res.headers.get("link") || '').split(',')[0].match(/rel=["']next["']/)
      }) );
  }
  private getRepoListPageStream(id,page=1){
    return this.getRepoListSinglePage(id, page)
      .flatMap((page)=>{
        let ret = Observable.of(page);
        if(!page.isLast){
          return ret.concat( this.getRepoListPageStream(id, page.pageNumber+1 ) );
        }
        return ret;
      }).share()
  }
  getRepoListPages(id){
    let page$ = this.getRepoListPageStream(id);
    let all$ = page$.map(val=>val.repos).scan((acc, val)=> (acc||[]).concat(val));
    let last$ = page$.filter(val => val.isLast);
    return all$.sample(last$);
  }
}
