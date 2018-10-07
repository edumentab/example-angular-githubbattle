/*
A service with methods to make URL:s for request to the (Github) backend.
Used in the Github service.

Uses the auth service since it needs the current login token to form the URL.
*/


import { Injectable } from '@angular/core';

import { AuthService } from './authservice';

const baseUrl = 'https://api.github.com/';

@Injectable()
export class UrlService {
  constructor(private authService: AuthService){}
  urlToRepoList(id, page=1) {
    return baseUrl + 'users/' + id + '/repos?per_page=100&page=' + page + '&access_token=' + this.authService.authState.token;
  }
  urlToUser(id) {
    return baseUrl + 'users/' + id + '?access_token=' +  this.authService.authState.token;
  }
}
