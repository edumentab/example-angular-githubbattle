/******************************************
Unit tests for the GithubService service. We need to test...

 * public getUser method
 * public getRepoListPages method
 * http service usage
 * url service usage

/*******************************************/

// --------------- Service mocks ---------------

import * as sinon from 'sinon';

const fakeHttpService = {
  get: sinon.stub()
};

const fakeUrlService = {
  urlToUser: sinon.stub(),
  urlToUserRepoListPage: sinon.stub()
};

// --------------- Test config ---------------

import { HttpClient } from '@angular/common/http';
import { UrlService } from '../services/urlservice';
import { GithubService } from '../services/githubservice';

const testModuleConfig = {
  providers: [GithubService, {provide: HttpClient, useValue: fakeHttpService}, {provide: UrlService, useValue: fakeUrlService}]
}

// --------------- Test suite ---------------

import { TestBed, getTestBed } from '@angular/core/testing';
import { expect } from 'chai';

let service: GithubService;

describe('GithubService', () => {
  before(() => TestBed.configureTestingModule(testModuleConfig));
  after(() => getTestBed().resetTestingModule());

  beforeEach(() => {
    sinon.resetHistory();
    sinon.resetBehavior();
    service = TestBed.get(GithubService);
  });

  it('should instantiate ok', () => {
    expect(service).to.exist;
  });

  describe('the getUser method', () => {
    const fakeUserId = Math.random().toString();
    const fakeUserUrl = Math.random().toString();
    const fakeGetObservable = Symbol();
    beforeEach(() => {
      fakeUrlService.urlToUser.returns(fakeUserUrl);
      fakeHttpService.get.returns(fakeGetObservable);
    });

    it('should call url service with id to get url to user', () => {
      service.getUser(fakeUserId);
      expect(fakeUrlService.urlToUser.called).to.be.true;
      expect(fakeUrlService.urlToUser.lastCall.args[0]).to.equal(fakeUserId);
    });

    it('should pass the user url to .get method of the http service', () => {
      service.getUser(fakeUserId);
      expect(fakeHttpService.get.called).to.be.true;
      expect(fakeHttpService.get.lastCall.args[0]).to.equal(fakeUserUrl);
    });

    it('should return the return value from the get method', () => {
      expect(service.getUser(fakeUserId)).to.equal(fakeGetObservable);
    });
  });
});
