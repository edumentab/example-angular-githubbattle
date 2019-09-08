/******************************************
Unit tests for the GithubService service. We need to test...

 * public getUser method
 * public getRepoListPages method
 * http service usage
 * url service usage

/*******************************************/

// --------------- Service mocks ---------------

const fakeHttpService = {
  get: jest.fn().mockImplementation(() => new EventEmitter())
};

const fakeUrlService = {
  urlToUser: jest.fn().mockImplementation(() => Symbol(`generated URL to user`)),
  urlToRepoList: jest.fn().mockImplementation(() => Symbol(`generated URL to repos`))
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

let service: GithubService;

describe('GithubService', () => {
  beforeEach(() => TestBed.configureTestingModule(testModuleConfig));
  afterEach(() => getTestBed().resetTestingModule());

  beforeEach(() => {
    jest.clearAllMocks();
    fakeHttpService.get.mockImplementation(() => new EventEmitter())
    service = TestBed.get(GithubService);
  });

  it('should instantiate ok', () => {
    expect(service).toBeTruthy();
  });

  describe('the getUser method', () => {
    const fakeUserId = Math.random().toString();
    const resultListener = jest.fn();

    beforeEach(() => {
      service.getUser(fakeUserId).subscribe(resultListener);
    });

    it('should call url service with id to get url to user', () => {
      expect(fakeUrlService.urlToUser).toBeCalled();
      expect(fakeUrlService.urlToUser).toHaveBeenLastCalledWith(fakeUserId);
    });

    it('should pass the user url to .get method of the http service', () => {
      expect(fakeHttpService.get).toBeCalled();
      expect(fakeHttpService.get.mock.calls[0][0]).toBe(fakeUrlService.urlToUser.mock.results[0].value);
    });

    it('should return an observable which emits the .get reply', () => {
      const fakeData = Symbol('some data');
      fakeHttpService.get.mock.results[0].value.emit(fakeData);
      expect(resultListener).toBeCalled();
      expect(resultListener).toHaveBeenLastCalledWith(fakeData);
    });
  });

  describe('the getRepos method', () => {
    const fakeUserId = Symbol('some user ID');
    const resultListener = jest.fn();

    beforeEach(() => {
      service.getRepos(fakeUserId).subscribe(resultListener);
    });

    it('should call url service with id to get url to first page of repo list', () => {
      expect(fakeUrlService.urlToRepoList).toBeCalled();
      expect(fakeUrlService.urlToRepoList).toHaveBeenLastCalledWith(fakeUserId, 1);
    });

    it('should pass the repo list url to .get method of the http service', () => {
      expect(fakeHttpService.get).toBeCalled();
      expect(fakeHttpService.get.mock.calls[0][0]).toBe(fakeUrlService.urlToRepoList.mock.results[0].value);
    });

    it('should not emit anything to returned stream before get stream emits', () => {
      expect(resultListener).not.toBeCalled();
    });

    describe('single page result', () => {
      const singlePageReply = {
        body: ['foo', 'bar'],
        headers: {
          get: jest.fn().mockReturnValue('') // if link string doesnt contain rel="next/last", then it is the last page
        }
      }

      beforeEach(() => {
        fakeHttpService.get.mock.results[0].value.emit(singlePageReply);
      });

      it('should query the "link" header', () => {
        expect(singlePageReply.headers.get).toBeCalledTimes(1);
        expect(singlePageReply.headers.get).toBeCalledWith("link");
      });

      it('should emit the body with the repos prop to the returned stream', () => {
        expect(resultListener).toBeCalled();
        expect(resultListener).toHaveBeenLastCalledWith(singlePageReply.body);
      });

      it('should only have made a single get request', () => {
        expect(fakeHttpService.get).toBeCalledTimes(1);
      });
    });

    describe('multi page result, getting page 1/3', () => {
      const firstPage = {
        body: [1,2,3],
        headers: { get: () => 'rel="last" rel="next"' },
      };
      beforeEach(() => {
        fakeHttpService.get.mock.results[0].value.emit(firstPage);
      });

      it('should not emit anything', () => {
        expect(resultListener).not.toBeCalled();
      });

      it('should ask for the url to the second page', () => {
        expect(fakeUrlService.urlToRepoList).toBeCalledTimes(2);
        expect(fakeUrlService.urlToRepoList).toHaveBeenLastCalledWith(fakeUserId,2);
      });

      it('should make a get request for the second page', () => {
        expect(fakeHttpService.get).toBeCalledTimes(2);
        expect(fakeHttpService.get.mock.calls[1][0]).toBe(fakeUrlService.urlToRepoList.mock.results[1].value);
      });

      describe('getting page 2/3', () => {
        const secondPage = {
          body: [4,5,6],
          headers: { get: () => 'rel="last" rel="next"' },
        };
        beforeEach(() => {
          fakeHttpService.get.mock.results[1].value.emit(secondPage);
        });

        it('should not emit anything', () => {
          expect(resultListener).not.toBeCalled();
        });
  
        it('should ask for the url to the third page', () => {
          expect(fakeUrlService.urlToRepoList).toBeCalledTimes(3);
          expect(fakeUrlService.urlToRepoList).toHaveBeenLastCalledWith(fakeUserId,3);
        });
  
        it('should make a get request for the third page', () => {
          expect(fakeHttpService.get).toBeCalledTimes(3);
          expect(fakeHttpService.get.mock.calls[2][0]).toBe(fakeUrlService.urlToRepoList.mock.results[2].value);
        });

        describe('getting page 3/3', () => {
          const thirdPage = {
            body: [7,8,9],
            headers: { get: () => '' },
          };
          beforeEach(() => {
            fakeHttpService.get.mock.results[2].value.emit(thirdPage);
          });

          it('should emit list of all repos to return stream', () => {
            expect(resultListener).toBeCalled();
            expect(resultListener).toHaveBeenLastCalledWith([...firstPage.body, ...secondPage.body, ...thirdPage.body]);
          });

          it('should not make any further get requests', () => {
            expect(fakeHttpService.get).toBeCalledTimes(3); //we didnt make a fourth request;
          });
        });
      });
    });
  });
});
