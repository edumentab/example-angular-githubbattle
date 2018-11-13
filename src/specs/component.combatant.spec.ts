/******************************************
Unit tests for the Combatant component. We need to test...

 * template
 * stars output
 * combatantdetail child input
 * battleservice usage

/*******************************************/

// --------------- Service mocks ---------------

import * as sinon from 'sinon';

const fakeBattleServiceObservable = {
  subscribe: sinon.stub()
};

const fakeBattleService = {
  battleInfoForUser: sinon.stub().returns(fakeBattleServiceObservable)
};

// --------------- Test config ---------------

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MockComponent, MockedComponent } from 'ng-mocks';

import { CombatantComponent } from '../components/combatant';
import { CombatantDetailComponent } from '../components/combatantdetail';
import { BattleService } from '../services/battleservice';

const testModuleConfig = {
  imports: [FormsModule, CommonModule],
  declarations: [CombatantComponent, MockComponent(CombatantDetailComponent)],
  providers: [{provide: BattleService, useValue: fakeBattleService}]
}

// --------------- Test suite ---------------

import { TestBed, getTestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { expect } from 'chai';
import { DebugElement } from '@angular/core';
import { CombatantInfo, CombatantRepoInfo } from '../types';

let fixture: ComponentFixture<CombatantComponent>
let instance: CombatantComponent
let debugElement: DebugElement
let nativeElement: HTMLElement;
let starsListener = sinon.stub();

describe('CombatantComponent', () => {
  before(() => TestBed.configureTestingModule(testModuleConfig));
  after(() => getTestBed().resetTestingModule());

  beforeEach(() => {
    sinon.resetHistory();
    fixture = TestBed.createComponent(CombatantComponent);
    debugElement = fixture.debugElement;
    instance = debugElement.componentInstance;
    instance.stars.subscribe(starsListener); // To be able to test the stars output
    nativeElement = debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should instantiate ok', () => {
    expect(instance).to.exist;
  });

  it('should start with no indicators, no details and a disabled button', () => {
    expect(nativeElement.querySelector('.qa-load-indicator')).to.not.exist;
    expect(nativeElement.querySelector('.qa-error-indicator')).to.not.exist;
    expect(nativeElement.querySelector('combatantdetail')).to.not.exist;
    expect(nativeElement.querySelector('.qa-load-button[disabled]')).to.exist;
  });

  it('should not call service if we click button when field is empty', () => {
    nativeElement.querySelector(".qa-load-button").dispatchEvent(new Event('click'));
    fixture.detectChanges();

    expect(fakeBattleService.battleInfoForUser.called).to.be.false;
  });

  it('should not emit anything to stars output', () => {
    expect(starsListener.called).to.be.false;
  });

  describe('calling the service', () => {
    const fieldContent = Math.random.toString();

    beforeEach(() => {
      const field: HTMLInputElement = debugElement.query(By.css('.qa-github-input')).nativeElement;
      field.value = fieldContent;
      field.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      nativeElement.querySelector(".qa-load-button").dispatchEvent(new Event('click'));
      fixture.detectChanges();
    });

    it('should call service with form content when button clicked', ()=> {
      expect(fakeBattleService.battleInfoForUser.called).to.be.true;
      expect(fakeBattleService.battleInfoForUser.firstCall.args[0]).to.equal(fieldContent);
    });

    it('should subscribe to success and fail for the provided observable', () => {
      expect(fakeBattleServiceObservable.subscribe.called).to.be.true;
      expect(fakeBattleServiceObservable.subscribe.firstCall.args[0]).to.be.a('function');
      expect(fakeBattleServiceObservable.subscribe.firstCall.args[1]).to.be.a('function');
    });

    it('should show a loading indicator', ()=> {
      expect(nativeElement.querySelector('.qa-load-indicator')).to.exist;
    });

    it('should disable the button again', ()=> {
      expect(nativeElement.querySelector('.qa-load-button[disabled]')).to.exist;
    });

    it('should emit null to stars output', ()=> {
      expect(starsListener.callCount).to.equal(1);
      expect(starsListener.firstCall.args[0]).to.equal(null);
    });

    describe('success', () => {
      type RecursivePartial<T> = { [P in keyof T]?: RecursivePartial<T[P]>; }; // https://stackoverflow.com/a/47914631
      const fakeReply: RecursivePartial<CombatantInfo> = {
        repos: {
          stars: Math.ceil(Math.random() * 1000)
        }
      };

      beforeEach(() => {
        const serviceSuccessCallback = fakeBattleServiceObservable.subscribe.firstCall.args[0];
        serviceSuccessCallback(fakeReply);
        fixture.detectChanges();
      });

      it('should emit the received count to stars output', () => {
        expect(starsListener.callCount).to.equal(2); // first was when loading, second is the success
        expect(starsListener.lastCall.args[0]).to.equal(fakeReply.repos.stars);
      });

      it('should clear the contents of the field', () => {
        expect(debugElement.query(By.css('.qa-github-input')).nativeElement.value).to.equal('');
      });

      it('should stop showing a loading indicator', () => {
        expect(nativeElement.querySelector('.qa-load-indicator')).to.not.exist;
      });

      it('should send data to combatantdetail child', () => {
        expect(nativeElement.querySelector('combatantdetail')).to.exist;
        const detailInstance: MockedComponent<CombatantDetailComponent> = debugElement.query(By.css('combatantdetail')).componentInstance;
        expect(detailInstance.data).to.equal(fakeReply);
      });
    });

    describe('fail', () => {
      const fakeError = new Error('KABOOM');

      beforeEach(() => {
        const serviceFailCallback = fakeBattleServiceObservable.subscribe.firstCall.args[1];
        serviceFailCallback(fakeError);
        fixture.detectChanges();
      });

      it('should show an error indicator instead of the loading indicator', () => {
        expect(nativeElement.querySelector('.qa-load-indicator')).to.not.exist;
        expect(nativeElement.querySelector('.qa-error-indicator')).to.exist;
      });

      it('should emit null to stars output', ()=> {
        expect(starsListener.callCount).to.equal(2); // first was when loading, second is the fail
        expect(starsListener.lastCall.args[0]).to.equal(null);
      });
    });
  });
});
