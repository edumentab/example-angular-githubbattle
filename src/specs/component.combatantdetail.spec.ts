/******************************************
Unit tests for the CombatantDetail component. We need to test...

 * template for different data inputs

/*******************************************/

// --------------- Test config ---------------

import { CommonModule } from '@angular/common';

import { CombatantDetailComponent } from '../components/combatantdetail';

const testModuleConfig = {
  imports: [CommonModule],
  declarations: [CombatantDetailComponent],
}

// ------------ Mock input data -------------

type RecursivePartial<T> = { [P in keyof T]?: RecursivePartial<T[P]>; }; // https://stackoverflow.com/a/47914631
import { CombatantInfo } from '../types';

const basicData: RecursivePartial<CombatantInfo> = {
  id: Math.random().toString(),
  repos: {
    stars: Math.ceil(Math.random()*666),
    mostStarred: {}
  }
};

// --------------- Test suite ---------------

import { TestBed, getTestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

let fixture: ComponentFixture<CombatantDetailComponent>
let instance: CombatantDetailComponent
let debugElement: DebugElement
let nativeElement: HTMLElement;

describe('CombatantDetailComponent', () => {
  beforeEach(() => TestBed.configureTestingModule(testModuleConfig));
  afterEach(() => getTestBed().resetTestingModule());

  beforeEach(() => {
    fixture = TestBed.createComponent(CombatantDetailComponent);
    debugElement = fixture.debugElement;
    instance = debugElement.componentInstance;
    // @ts-ignore (to let us pass partial data)
    instance.data = basicData;
    nativeElement = debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should instantiate ok', () => {
    expect(instance).toBeTruthy();
  });

  it('should render a correct github link', () => {
    const link: HTMLAnchorElement = nativeElement.querySelector('.qa-github-link');
    expect(link.getAttribute('href')).toBe(`http://github.com/${basicData.id}`);
    expect(link.innerHTML).toBe(basicData.id);
  });

  it('should include star count', () => {
    const info: HTMLElement = nativeElement.querySelector('.qa-basic-info');
    expect(info.innerHTML).toContain(`has ${basicData.repos.stars} stars`);
  });

  it('should not render a section for most starred', () => {
    expect(nativeElement.querySelector('.qa-most-starred')).not.toBeTruthy();
  });

  it('should not render a language section', () => {
    expect(nativeElement.querySelector('.qa-language')).not.toBeTruthy();
  });

  describe('when data for most starred', () => {
    const dataWithMostStarred: RecursivePartial<CombatantInfo> = {
      id: Math.random().toString(),
      repos: {
        mostStarred: {
          name: Math.random().toString(),
          stargazers_count: Math.ceil(Math.random()*666),
        }
      }
    };

    beforeEach(() => {
      // @ts-ignore (to let us pass partial data)
      instance.data = dataWithMostStarred;
      fixture.detectChanges();
    });

    it('should render a section for most starred', () => {
      expect(nativeElement.querySelector('.qa-most-starred')).toBeTruthy();
    });

    it('should include star count for that repo', () => {
      const info: HTMLElement = nativeElement.querySelector('.qa-most-starred');
      expect(info.innerHTML).toContain(`with ${dataWithMostStarred.repos.mostStarred.stargazers_count} stars`);
    });

    it('should have a correct link to that repo', () => {
      const link: HTMLAnchorElement = nativeElement.querySelector('.qa-most-starred a');
      const expectedURL = `http://github.com/${dataWithMostStarred.id}/${dataWithMostStarred.repos.mostStarred.name}`;
      expect(link.getAttribute('href')).toBe(expectedURL);
      expect(link.innerHTML).toContain(dataWithMostStarred.repos.mostStarred.name);
    });
  });

  describe('the language table', () => {
    const dataWithLangCount: RecursivePartial<CombatantInfo> = {
      repos: {
        mostStarred: {},
        repos: 5, // just needs to be more than 1
        languages: {
          last: 1,
          first: 10,
          middle: 5
        }
      }
    };

    beforeEach(() => {
      // @ts-ignore (to let us pass partial data)
      instance.data = dataWithLangCount;
      fixture.detectChanges();
    });

    it('should render a language section', () => {
      expect(nativeElement.querySelector('.qa-language')).toBeTruthy();
    });

    it('should render a sorted table', () => {
      const tableBody = nativeElement.querySelector('.qa-language tbody');
      expect(tableBody.querySelector('tr:first-child td:first-child').innerHTML).toBe('first');
      expect(tableBody.querySelector('tr:first-child td:last-child').innerHTML).toBe(dataWithLangCount.repos.languages.first.toString());
      expect(tableBody.querySelector('tr:nth-child(2) td:first-child').innerHTML).toBe('middle');
      expect(tableBody.querySelector('tr:nth-child(2) td:last-child').innerHTML).toBe(dataWithLangCount.repos.languages.middle.toString());
      expect(tableBody.querySelector('tr:last-child td:first-child').innerHTML).toBe('last');
      expect(tableBody.querySelector('tr:last-child td:last-child').innerHTML).toBe(dataWithLangCount.repos.languages.last.toString());
    });
  });
});
