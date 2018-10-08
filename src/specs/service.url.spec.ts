/******************************************
Unit tests for the Url service. We need to test...

 * public urlToRepoList method
 * public urlToUser method
 * auth service usage

/*******************************************/

// --------------- Service mocks ---------------

import * as sinon from 'sinon';

const fakeAuthService = {
  authState: {
    token: Math.random.toString()
  }
};

// --------------- Test config ---------------

import { UrlService } from '../services/urlservice';
import { AuthService } from '../services/authservice';

const testModuleConfig = {
  providers: [
    UrlService,
    {provide: AuthService, useValue: fakeAuthService},
  ]
}

// --------------- Test suite ---------------

import { TestBed, getTestBed } from '@angular/core/testing';
import { expect } from 'chai';

let service: UrlService;

describe('UrlService', () => {
  before(() => TestBed.configureTestingModule(testModuleConfig));
  after(() => getTestBed().resetTestingModule());

  const baseUrl = 'https://api.github.com/';

  beforeEach(() => {
    service = TestBed.get(UrlService);
  });

  it('should instantiate ok', () => {
    expect(service).to.exist;
  });

  describe('the urlToUser method', () => {
    const fakeUserId = Math.random().toString();
    let result;

    beforeEach(() => {
      result = service.urlToUser(fakeUserId);
    });

    it('should give correct base URL', () => {
      expect(result.split('?')[0]).to.equal(`${baseUrl}users/${fakeUserId}`);
    });

    it('should include access token as query param', () => {
      expect(result.split('?')[1]).to.contain(`access_token=${fakeAuthService.authState.token}`);
    });
  });

  describe('the urlToRepoList method', () => {
    const fakeUserId = Math.random().toString();
    const fakePage = Math.ceil(Math.random()*100);
    let result;

    beforeEach(() => {
      result = service.urlToRepoList(fakeUserId, fakePage);
    });

    it('should give correct base URL', () => {
      expect(result.split('?')[0]).to.equal(`${baseUrl}users/${fakeUserId}/repos`);
    });

    it('should include access token as query param', () => {
      expect(result.split('?')[1]).to.contain(`access_token=${fakeAuthService.authState.token}`);
    });

    it('should include page as query param', () => {
      expect(result.split('?')[1]).to.contain(`page=${fakePage}`);
    });
  });
});
