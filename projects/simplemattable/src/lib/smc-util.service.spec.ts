import {TestBed} from '@angular/core/testing';

import {SmcUtilService} from './smc-util.service';
import {Align} from './model/align.model';

describe('Util.Service.TsService', () => {
  let utilService: SmcUtilService;

  beforeEach(() => {
    utilService = new SmcUtilService();
  });

  it('cell align', () => {
    expect(utilService.getCellAlign(Align.LEFT)).toBe('start center');
    expect(utilService.getCellAlign(Align.CENTER)).toBe('center center');
    expect(utilService.getCellAlign(Align.RIGHT)).toBe('end center');
  });
  it('text align', () => {
    expect(utilService.getTextAlign(Align.LEFT)).toBe('start');
    expect(utilService.getTextAlign(Align.CENTER)).toBe('center');
    expect(utilService.getTextAlign(Align.RIGHT)).toBe('end');
  });
  it('array to object', () => {
    // array to object
    const arr = ['42a', '42b'];
    expect(utilService.arrayToObject(arr)).toEqual({'42a': true, '42b': true});
    expect(utilService.arrayToObject([])).toEqual({});
  });

});
