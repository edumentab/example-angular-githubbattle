/******************************************
Unit tests for the App component. We need to test...

 * template
 * login functionality
 * correct usage of the Auth service

/*******************************************/

// --------------- Service mocks ---------------

import * as sinon from 'sinon';

const fakeAuthService = {
  signInWithPopup: sinon.stub(),
  listenToAuthChanges: sinon.stub()
};

// --------------- Test config ---------------

import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AuthService } from '../services/authservice';
import { AppComponent } from '../components/app';

const testModuleConfig = {
  imports: [CommonModule],
  declarations: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA], // to prevent complaints about unknown 'battle' element
  providers: [{provide: AuthService, useValue: fakeAuthService}]
}

// --------------- Test suite ---------------

import { TestBed, getTestBed, ComponentFixture } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

let fixture: ComponentFixture<AppComponent>
let instance: AppComponent
let debugElement: DebugElement
let nativeElement: HTMLElement;

describe('AppComponent', () => {
  beforeEach(() => TestBed.configureTestingModule(testModuleConfig));
  afterEach(() => getTestBed().resetTestingModule());

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    debugElement = fixture.debugElement;
    instance = debugElement.componentInstance;
    nativeElement = debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should instantiate ok', () => {
    expect(instance).toBeTruthy();
  });

  describe('when not logged in', () => {
    it('should not render a battle component yet', () => {
      expect(nativeElement.querySelector('battle')).not.toBeTruthy();
    });
  
    it('should render a login button', () => {
      expect(nativeElement.querySelector('.qa-login-button')).toBeTruthy();
    });

    it('should be listening to auth changes', () => {
      expect(fakeAuthService.listenToAuthChanges.called).toBe(true);
      expect(fakeAuthService.listenToAuthChanges.lastCall.args[0]).toBeInstanceOf(Function);
    });

    it('should not trigger popup immediately', () => {
      expect(fakeAuthService.signInWithPopup.called).toBe(false);
    });

    it('should trigger popup when button is clicked', () => {
      nativeElement.querySelector('.qa-login-button').dispatchEvent(new Event('click'));
      expect(fakeAuthService.signInWithPopup.called).toBe(true);
    });
  });

  describe('when login error', () => {
    beforeEach(() => {
      const authCallback = fakeAuthService.listenToAuthChanges.lastCall.args[0];
      authCallback({ user: {}, error: Symbol('some error') });
      fixture.detectChanges();
    });

    it('should render an error section', () => {
      expect(nativeElement.querySelector('.qa-error-section')).toBeTruthy();
    });

    it('should still render a login button', () => {
      expect(nativeElement.querySelector('.qa-login-button')).toBeTruthy();
    });
  });

  describe('when logged in', () => {
    const fakeAuth = {
      token: Math.random().toString(),
      user: {
        displayName: Math.random().toString()
      }
    };

    beforeEach(() => {
      const authCallback = fakeAuthService.listenToAuthChanges.lastCall.args[0];
      authCallback(fakeAuth);
      fixture.detectChanges();
    });

    it('should not render login button', () => {
      expect(nativeElement.querySelector('.qa-login-button')).not.toBeTruthy();
    });

    it('should render login section with user name', () => {
      expect(nativeElement.querySelector('.qa-loggedin').innerHTML).toContain(fakeAuth.user.displayName);
    });

    it('should render a battle component', () => {
      expect(nativeElement.querySelector('battle')).toBeTruthy();
    });
  });
});
