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
import { expect } from 'chai';
import { DebugElement } from '@angular/core';

let fixture: ComponentFixture<CombatantDetailComponent>
let instance: CombatantDetailComponent
let debugElement: DebugElement
let nativeElement: HTMLElement;

describe('CombatantDetailComponent', () => {
  before(() => TestBed.configureTestingModule(testModuleConfig));
  after(() => getTestBed().resetTestingModule());

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
    expect(instance).to.exist;
  });

  it('should render a correct github link', () => {
    const link: HTMLAnchorElement = nativeElement.querySelector('.qa-github-link');
    expect(link.getAttribute('href')).to.equal(`http://github.com/${basicData.id}`);
    expect(link.innerHTML).to.equal(basicData.id);
  });

  it('should include star count', () => {
    const info: HTMLElement = nativeElement.querySelector('.qa-basic-info');
    expect(info.innerHTML).to.include(`has ${basicData.repos.stars} stars`);
  });

  it('should not render a section for most starred', () => {
    expect(nativeElement.querySelector('.qa-most-starred')).to.not.exist;
  });

  it('should not render a language section', () => {
    expect(nativeElement.querySelector('.qa-language')).to.not.exist;
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
      expect(nativeElement.querySelector('.qa-most-starred')).to.exist;
    });

    it('should include star count for that repo', () => {
      const info: HTMLElement = nativeElement.querySelector('.qa-most-starred');
      expect(info.innerHTML).to.include(`with ${dataWithMostStarred.repos.mostStarred.stargazers_count} stars`);
    });

    it('should have a correct link to that repo', () => {
      const link: HTMLAnchorElement = nativeElement.querySelector('.qa-most-starred a');
      const expectedURL = `http://github.com/${dataWithMostStarred.id}/${dataWithMostStarred.repos.mostStarred.name}`;
      expect(link.getAttribute('href')).to.equal(expectedURL);
      expect(link.innerHTML).to.include(dataWithMostStarred.repos.mostStarred.name);
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
      expect(nativeElement.querySelector('.qa-language')).to.exist;
    });

    it('should render a sorted table', () => {
      const tableBody = nativeElement.querySelector('.qa-language tbody');
      expect(tableBody.querySelector('tr:first-child td:first-child').innerHTML).to.equal('first');
      expect(tableBody.querySelector('tr:first-child td:last-child').innerHTML).to.equal(dataWithLangCount.repos.languages.first.toString());
      expect(tableBody.querySelector('tr:nth-child(2) td:first-child').innerHTML).to.equal('middle');
      expect(tableBody.querySelector('tr:nth-child(2) td:last-child').innerHTML).to.equal(dataWithLangCount.repos.languages.middle.toString());
      expect(tableBody.querySelector('tr:last-child td:first-child').innerHTML).to.equal('last');
      expect(tableBody.querySelector('tr:last-child td:last-child').innerHTML).to.equal(dataWithLangCount.repos.languages.last.toString());
    });
  });
});
