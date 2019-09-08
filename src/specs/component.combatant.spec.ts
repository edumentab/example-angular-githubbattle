/******************************************
Unit tests for the Combatant component. We need to test...

 * template
 * stars output
 * combatantdetail child input
 * battleservice usage

/*******************************************/

// --------------- Service mocks ---------------


const fakeBattleServiceObservable = {
  subscribe: jest.fn()
};

const fakeBattleService = {
  battleInfoForUser: jest.fn().mockReturnValue(fakeBattleServiceObservable)
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
import { DebugElement } from '@angular/core';
import { CombatantInfo, CombatantRepoInfo } from '../types';

let fixture: ComponentFixture<CombatantComponent>
let instance: CombatantComponent
let debugElement: DebugElement
let nativeElement: HTMLElement;
let starsListener = jest.fn();

describe('CombatantComponent', () => {
  beforeEach(() => TestBed.configureTestingModule(testModuleConfig));
  afterEach(() => getTestBed().resetTestingModule());

  beforeEach(() => {
    jest.clearAllMocks();
    fixture = TestBed.createComponent(CombatantComponent);
    debugElement = fixture.debugElement;
    instance = debugElement.componentInstance;
    instance.stars.subscribe(starsListener); // To be able to test the stars output
    nativeElement = debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should instantiate ok', () => {
    expect(instance).toBeTruthy();
  });

  it('should start with no indicators, no details and a disabled button', () => {
    expect(nativeElement.querySelector('.qa-load-indicator')).not.toBeTruthy();
    expect(nativeElement.querySelector('.qa-error-indicator')).not.toBeTruthy();
    expect(nativeElement.querySelector('combatantdetail')).not.toBeTruthy();
    expect(nativeElement.querySelector('.qa-load-button[disabled]')).toBeTruthy();
  });

  it('should not call service if we click button when field is empty', () => {
    nativeElement.querySelector(".qa-load-button").dispatchEvent(new Event('click'));
    fixture.detectChanges();

    expect(fakeBattleService.battleInfoForUser).not.toBeCalled();
  });

  it('should not emit anything to stars output', () => {
    expect(starsListener).not.toBeCalled();
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
      expect(fakeBattleService.battleInfoForUser).toBeCalled();
      expect(fakeBattleService.battleInfoForUser.mock.calls[0][0]).toBe(fieldContent);
    });

    it('should subscribe to success and fail for the provided observable', () => {
      expect(fakeBattleServiceObservable.subscribe).toBeCalled();
      expect(fakeBattleServiceObservable.subscribe.mock.calls[0][0]).toBeInstanceOf(Function);
      expect(fakeBattleServiceObservable.subscribe.mock.calls[0][1]).toBeInstanceOf(Function);
    });

    it('should show a loading indicator', ()=> {
      expect(nativeElement.querySelector('.qa-load-indicator')).toBeTruthy();
    });

    it('should disable the button again', ()=> {
      expect(nativeElement.querySelector('.qa-load-button[disabled]')).toBeTruthy();
    });

    it('should emit null to stars output', ()=> {
      expect(starsListener).toBeCalledTimes(1);
      expect(starsListener.mock.calls[0][0]).toBe(null);
    });

    describe('success', () => {
      type RecursivePartial<T> = { [P in keyof T]?: RecursivePartial<T[P]>; }; // https://stackoverflow.com/a/47914631
      const fakeReply: RecursivePartial<CombatantInfo> = {
        repos: {
          stars: Math.ceil(Math.random() * 1000)
        }
      };

      beforeEach(() => {
        const serviceSuccessCallback = fakeBattleServiceObservable.subscribe.mock.calls[0][0];
        serviceSuccessCallback(fakeReply);
        fixture.detectChanges();
      });

      it('should emit the received count to stars output', () => {
        expect(starsListener).toBeCalledTimes(2); // first was when loading, second is the success
        expect(starsListener).toHaveBeenLastCalledWith(fakeReply.repos.stars);
      });

      it('should clear the contents of the field', () => {
        expect(debugElement.query(By.css('.qa-github-input')).nativeElement.value).toBe('');
      });

      it('should stop showing a loading indicator', () => {
        expect(nativeElement.querySelector('.qa-load-indicator')).not.toBeTruthy();
      });

      it('should send data to combatantdetail child', () => {
        expect(nativeElement.querySelector('combatantdetail')).toBeTruthy();
        const detailInstance: MockedComponent<CombatantDetailComponent> = debugElement.query(By.css('combatantdetail')).componentInstance;
        expect(detailInstance.data).toBe(fakeReply);
      });
    });

    describe('fail', () => {
      const fakeError = new Error('KABOOM');

      beforeEach(() => {
        const serviceFailCallback = fakeBattleServiceObservable.subscribe.mock.calls[0][1];
        serviceFailCallback(fakeError);
        fixture.detectChanges();
      });

      it('should show an error indicator instead of the loading indicator', () => {
        expect(nativeElement.querySelector('.qa-load-indicator')).not.toBeTruthy();
        expect(nativeElement.querySelector('.qa-error-indicator')).toBeTruthy();
      });

      it('should emit null to stars output', ()=> {
        expect(starsListener).toBeCalledTimes(2); // first was when loading, second is the fail
        expect(starsListener).toHaveBeenLastCalledWith(null);
      });
    });
  });
});
