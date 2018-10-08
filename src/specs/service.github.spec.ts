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
  get: sinon.stub().callsFake(() => new EventEmitter())
};

const fakeUrlService = {
  urlToUser: sinon.stub().callsFake(() => Symbol(`generated URL to user`)),
  urlToRepoList: sinon.stub().callsFake(() => Symbol(`generated URL to repos`))
};

// --------------- Test config ---------------

import { HttpClient } from '@angular/common/http';
import { UrlService } from '../services/urlservice';
import { GithubService } from '../services/githubservice';

const testModuleConfig = {
  providers: [
    GithubService,
    {provide: HttpClient, useValue: fakeHttpService},
    {provide: UrlService, useValue: fakeUrlService}
  ]
}

// --------------- Test suite ---------------

import { EventEmitter } from '@angular/core';
import { TestBed, getTestBed } from '@angular/core/testing';
import { expect } from 'chai';

let service: GithubService;

describe('GithubService', () => {
  before(() => TestBed.configureTestingModule(testModuleConfig));
  after(() => getTestBed().resetTestingModule());

  beforeEach(() => {
    sinon.resetHistory();
    fakeHttpService.get.callsFake(() => new EventEmitter())
    service = TestBed.get(GithubService);
  });

  it('should instantiate ok', () => {
    expect(service).to.exist;
  });

  describe('the getUser method', () => {
    const fakeUserId = Math.random().toString();
    const resultListener = sinon.stub();

    beforeEach(() => {
      service.getUser(fakeUserId).subscribe(resultListener);
    });

    it('should call url service with id to get url to user', () => {
      expect(fakeUrlService.urlToUser.called).to.be.true;
      expect(fakeUrlService.urlToUser.lastCall.args[0]).to.equal(fakeUserId);
    });

    it('should pass the user url to .get method of the http service', () => {
      expect(fakeHttpService.get.called).to.be.true;
      expect(fakeHttpService.get.lastCall.args[0]).to.equal(fakeUrlService.urlToUser.lastCall.returnValue);
    });

    it('should return an observable which emits the .get reply', () => {
      const fakeData = Symbol('some data');
      fakeHttpService.get.lastCall.returnValue.emit(fakeData);
      expect(resultListener.called).to.be.true;
      expect(resultListener.lastCall.args[0]).to.equal(fakeData);
    });
  });

  describe('the getRepos method', () => {
    const fakeUserId = Symbol('some user ID');
    const resultListener = sinon.stub();

    beforeEach(() => {
      service.getRepos(fakeUserId).subscribe(resultListener);
    });

    it('should call url service with id to get url to first page of repo list', () => {
      expect(fakeUrlService.urlToRepoList.called).to.be.true;
      expect(fakeUrlService.urlToRepoList.lastCall.args[0]).to.equal(fakeUserId);
      expect(fakeUrlService.urlToRepoList.lastCall.args[1]).to.equal(1);
    });

    it('should pass the repo list url to .get method of the http service', () => {
      expect(fakeHttpService.get.called).to.be.true;
      expect(fakeHttpService.get.lastCall.args[0]).to.equal(fakeUrlService.urlToRepoList.lastCall.returnValue);
    });

    it('should not emit anything to returned stream before get stream emits', () => {
      expect(resultListener.called).to.be.false;
    });

    describe('single page result', () => {
      const singlePageReply = {
        body: ['foo', 'bar'],
        headers: {
          get: sinon.stub().returns('') // if link string doesnt contain rel="next/last", then it is the last page
        }
      }
      beforeEach(() => {
        fakeHttpService.get.firstCall.returnValue.emit(singlePageReply);
      });
      it('should query the "link" header', () => {
        expect(singlePageReply.headers.get.callCount).to.equal(1);
        expect(singlePageReply.headers.get.firstCall.args[0]).to.equal("link");
      });
      it('should emit the body with the repos prop to the returned stream', () => {
        expect(resultListener.called).to.be.true;
        expect(resultListener.lastCall.args[0]).to.equal(singlePageReply.body);
      });
      it('should only have made a single get request', () => {
        expect(fakeHttpService.get.callCount).to.equal(1);
      });
    });

    describe('multi page result, getting page 1/3', () => {
      const firstPage = {
        body: [1,2,3],
        headers: { get: () => 'rel="last" rel="next"' },
      };
      beforeEach(() => {
        fakeHttpService.get.firstCall.returnValue.emit(firstPage);
      });

      it('should not emit anything', () => {
        expect(resultListener.called).to.be.false;
      });

      it('should ask for the url to the second page', () => {
        expect(fakeUrlService.urlToRepoList.callCount).to.equal(2);
        expect(fakeUrlService.urlToRepoList.lastCall.args[0]).to.equal(fakeUserId);
        expect(fakeUrlService.urlToRepoList.lastCall.args[1]).to.equal(2);
      });

      it('should make a get request for the second page', () => {
        expect(fakeHttpService.get.callCount).to.equal(2);
        expect(fakeHttpService.get.lastCall.args[0]).to.equal(fakeUrlService.urlToRepoList.lastCall.returnValue);
      });

      describe('getting page 2/3', () => {
        const secondPage = {
          body: [4,5,6],
          headers: { get: () => 'rel="last" rel="next"' },
        };
        beforeEach(() => {
          fakeHttpService.get.secondCall.returnValue.emit(secondPage);
        });

        it('should not emit anything', () => {
          expect(resultListener.called).to.be.false;
        });
  
        it('should ask for the url to the third page', () => {
          expect(fakeUrlService.urlToRepoList.callCount).to.equal(3);
          expect(fakeUrlService.urlToRepoList.lastCall.args[0]).to.equal(fakeUserId);
          expect(fakeUrlService.urlToRepoList.lastCall.args[1]).to.equal(3);
        });
  
        it('should make a get request for the third page', () => {
          expect(fakeHttpService.get.callCount).to.equal(3);
          expect(fakeHttpService.get.lastCall.args[0]).to.equal(fakeUrlService.urlToRepoList.lastCall.returnValue);
        });

        describe('getting page 3/3', () => {
          const thirdPage = {
            body: [7,8,9],
            headers: { get: () => '' },
          };
          beforeEach(() => {
            fakeHttpService.get.thirdCall.returnValue.emit(thirdPage);
          });

          it('should emit list of all repos to return stream', () => {
            expect(resultListener.called).to.be.true;
            expect(resultListener.lastCall.args[0]).to.eql([...firstPage.body, ...secondPage.body, ...thirdPage.body]);
          });

          it('should not make any further get requests', () => {
            expect(fakeHttpService.get.callCount).to.equal(3, 'we didnt make a fourth request');
          });
        });
      });
    });
  });
});
