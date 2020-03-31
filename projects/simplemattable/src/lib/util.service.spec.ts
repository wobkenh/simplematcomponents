import {TestBed} from '@angular/core/testing';

import {UtilService} from './util.service';
import {Align} from './model/align.model';

describe('Util.Service.TsService', () => {
  let utilService: UtilService;

  beforeEach(() => {
    utilService = new UtilService();
  });

  it('cell align', () => {
    expect(utilService.getCellAlign(Align.LEFT)).toBe('start center');
    expect(utilService.getCellAlign(Align.CENTER)).toBe('center center');
    expect(utilService.getCellAlign(Align.RIGHT)).toBe('end center');
  });
  it('text align', () => {
    expect(utilService.getTextAlign(Align.LEFT)).toBe('left');
    expect(utilService.getTextAlign(Align.CENTER)).toBe('center');
    expect(utilService.getTextAlign(Align.RIGHT)).toBe('right');
  });

});
