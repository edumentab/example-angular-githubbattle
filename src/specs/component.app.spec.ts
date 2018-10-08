/******************************************
Unit tests for the App component. We need to test...

 * template
 * login functionality
 * correct usage of the Auth service

/*******************************************/

// --------------- Child component stubs -----------------

import { Component } from '@angular/core';

@Component({
  selector: 'battle',
  template: ''
})
class FakeBattle {}

// --------------- Service mocks ---------------

import * as sinon from 'sinon';

const fakeAuthService = {
  signInWithPopup: sinon.stub(),
  listenToAuthChanges: sinon.stub()
};

// --------------- Test config ---------------

import { CommonModule } from '@angular/common';
import { AuthService } from '../services/authservice';
import { AppComponent } from '../components/app';

const testModuleConfig = {
  imports: [CommonModule],
  declarations: [AppComponent, FakeBattle],
  providers: [{provide: AuthService, useValue: fakeAuthService}]
}

// --------------- Test suite ---------------

import { TestBed, getTestBed, ComponentFixture } from '@angular/core/testing';
import { expect } from 'chai';
import { DebugElement } from '@angular/core';

let fixture: ComponentFixture<AppComponent>
let instance: AppComponent
let debugElement: DebugElement
let nativeElement: HTMLElement;

describe('AppComponent', () => {
  before(() => TestBed.configureTestingModule(testModuleConfig));
  after(() => getTestBed().resetTestingModule());

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    debugElement = fixture.debugElement;
    instance = debugElement.componentInstance;
    nativeElement = debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should instantiate ok', () => {
    expect(instance).to.exist;
  });

  describe('when not logged in', () => {
    it('should not render a battle component yet', () => {
      expect(nativeElement.querySelector('battle')).to.not.exist;
    });
  
    it('should render a login button', () => {
      expect(nativeElement.querySelector('.qa-login-button')).to.exist;
    });

    it('should be listening to auth changes', () => {
      expect(fakeAuthService.listenToAuthChanges.called).to.be.true;
      expect(fakeAuthService.listenToAuthChanges.lastCall.args[0]).to.be.a('function');
    });

    it('should not trigger popup immediately', () => {
      expect(fakeAuthService.signInWithPopup.called).to.be.false;
    });

    it('should trigger popup when button is clicked', () => {
      nativeElement.querySelector('.qa-login-button').dispatchEvent(new Event('click'));
      expect(fakeAuthService.signInWithPopup.called).to.be.true;
    });
  });

  describe('when login error', () => {
    beforeEach(() => {
      const authCallback = fakeAuthService.listenToAuthChanges.lastCall.args[0];
      authCallback({ user: {}, error: Symbol('some error') });
      fixture.detectChanges();
    });

    it('should render an error section', () => {
      expect(nativeElement.querySelector('.qa-error-section')).to.exist;
    });

    it('should still render a login button', () => {
      expect(nativeElement.querySelector('.qa-login-button')).to.exist;
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
      expect(nativeElement.querySelector('.qa-login-button')).to.not.exist;
    });

    it('should render login section with user name', () => {
      expect(nativeElement.querySelector('.qa-loggedin').innerHTML).to.contain(fakeAuth.user.displayName);
    });

    it('should render a battle component', () => {
      expect(nativeElement.querySelector('battle')).to.exist;
    });
  });
});
