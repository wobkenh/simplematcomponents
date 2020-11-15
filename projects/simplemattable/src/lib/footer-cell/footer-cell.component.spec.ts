import { waitForAsync } from '@angular/core/testing';

import {FooterCellComponent} from './footer-cell.component';
import {TableColumn} from '../model/table-column.model';
import {UtilService} from '../util.service';

describe('FooterCellComponent', () => {
  let dataSample1: ComplexTestData;
  let footerCell: FooterCellComponent<ComplexTestData>;
  let tableColumn: TableColumn<ComplexTestData, 'id'>;

  beforeEach(waitForAsync(() => {
    dataSample1 = new ComplexTestData(1, new TestData('a', 1, new Date()));
    const utilService = new UtilService();
    footerCell = new FooterCellComponent(utilService);
    tableColumn = new TableColumn<ComplexTestData, 'id'>('ID', 'id');
  }));

  it('ngClass plain object', () => {
    const res = footerCell.getCellCssClass(tableColumn, [dataSample1]);
    expect(res).toEqual({'filler-div': true});
  });
});

class ComplexTestData {
  constructor(public id: number, public testData: TestData) {
  }
}

class TestData {
  constructor(public key: string, public value: number, public date: Date) {
  }
}
