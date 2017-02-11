import { Injectable } from '@angular/core';

import { AuthService } from './authservice';

const baseUrl = 'https://api.github.com/';

@Injectable()
export class UrlService {
  constructor(private authService: AuthService){}
  urlToUserRepoListPage(id, page=1) {
    return baseUrl + 'users/' + id + '/repos?per_page=100&page=' + page + '&access_token=' + this.authService.getAuthState().token;
  }
  urlToUser(id) {
    return baseUrl + 'users/' + id + '?access_token=' +  this.authService.getAuthState().token;
  }
}