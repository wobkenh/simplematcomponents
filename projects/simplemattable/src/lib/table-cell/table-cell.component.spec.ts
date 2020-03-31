import {ButtonType} from '../model/button-type.model';
import {Height} from '../model/height.model';
import {FormBuilder, Validators} from '@angular/forms';
import {async} from '@angular/core/testing';
import {TableColumn} from '../model/table-column.model';
import {TableCellComponent} from './table-cell.component';
import {UtilService} from '../util.service';

describe('TableCellComponent', () => {
  let dataSample1: ComplexTestData;
  let tableCell: TableCellComponent<ComplexTestData>;
  let tableColumn: TableColumn<ComplexTestData, 'id'>;

  beforeEach(async(() => {
    dataSample1 = new ComplexTestData(1, new TestData('a', 1, new Date()));
    const utilService = new UtilService();
    tableCell = new TableCellComponent(new FormBuilder(), utilService);
    tableColumn = new TableColumn<ComplexTestData, 'id'>('ID', 'id');
  }));

  it('ngClass plain object', () => {
    const res = tableCell.getCellCssClass(tableColumn, dataSample1);
    expect(res).toEqual({'filler-div': true, 'on-click': undefined});
  });
  it('ngClass clickable', () => {
    tableColumn
      .withOnClick(() => {
      });
    const res = tableCell.getCellCssClass(tableColumn, dataSample1);
    expect(res).toEqual({'filler-div': true, 'on-click': true});
  });
  it('ngClass button and two classes', () => {
    tableColumn
      .withNgClass(() => 'testclass1 testclass2')
      .withOnClick(() => {
      })
      .withButton(ButtonType.BASIC);
    // no matter how you return it, should always result in the same ngClass
    expect(tableCell.getCellCssClass(tableColumn, dataSample1)).toEqual({
      'filler-div': true,
      'on-click': false,
      'testclass1': true,
      'testclass2': true
    });

    tableColumn.withNgClass(() => ['testclass1', 'testclass2']);
    expect(tableCell.getCellCssClass(tableColumn, dataSample1)).toEqual({
      'filler-div': true,
      'on-click': false,
      'testclass1': true,
      'testclass2': true
    });

    tableColumn.withNgClass(() => ({'testclass1': true, 'testclass2': true}));
    expect(tableCell.getCellCssClass(tableColumn, dataSample1)).toEqual({
      'filler-div': true,
      'on-click': false,
      'testclass1': true,
      'testclass2': true
    });
  });
  it('ngClass default style if ngClass returns falsy value', () => {
    tableColumn
      .withNgClass(() => null)
      .withOnClick(() => {
      })
      .withButton(ButtonType.BASIC);
    // ngClassFn gives back nothing --> should return default style
    expect(tableCell.getCellCssClass(tableColumn, dataSample1)).toEqual({'filler-div': true, 'on-click': false});
  });
  it('ngStyle', () => {
    expect(tableCell.getCellCssStyle(tableColumn, dataSample1)).toEqual({'textAlign': 'start', 'minHeight': '48px'});
    const style = {'textAlign': 'start', 'color': '#FFFFFF', 'border': '1px solid black', 'minHeight': '48px'};
    tableColumn.withNgStyle(() => style);
    expect(tableCell.getCellCssStyle(tableColumn, dataSample1)).toEqual(style);
  });
  it('ngStyle with height', () => {
    tableColumn.withHeightFn(() => Height.px(30));
    expect(tableCell.getCellCssStyle(tableColumn, dataSample1)).toEqual({'textAlign': 'start', 'height': '30px'});
    tableColumn.withHeightFn(() => Height.pct(30));
    expect(tableCell.getCellCssStyle(tableColumn, dataSample1)).toEqual({'textAlign': 'start', 'height': '30%'});
  });
  it('get form control', () => {
    tableCell.formControls = new Map();
    tableColumn
      .withFormField(tableColumn.getNumberFormField().withPlaceholder('placeholder').withHint('hint'));
    // new Form Control
    const formControl = tableCell.getFormControl(0, 0, tableColumn, dataSample1);
    expect(formControl).toBeTruthy();
    expect(tableColumn.formField.placeholder).toEqual('placeholder');
    expect(tableColumn.formField.hint).toEqual('hint');
    // Reload Form Control
    expect(tableCell.getFormControl(0, 0, tableColumn, dataSample1)).toBe(formControl);
    // New Form Control with init
    const validators = [Validators.required, Validators.min(5)];
    tableColumn.withFormField(tableColumn.getNumberFormField()
      .withInit(() => 420)
      .withValidators(validators));
    const res = tableCell.getFormControl(42, 0, tableColumn, dataSample1);
    expect(res.value).toBe(420);
    expect(res.valid).toBe(true);
    res.patchValue(2);
    expect(res.valid).toBe(false);
    res.patchValue(null);
    expect(res.valid).toBe(false);
    res.patchValue(100);
    expect(res.valid).toBe(true);

    tableColumn.withMaxLines(25)
      .withMinLines(5)
      .withFormField(tableColumn.getLargeTextFormField().withInit(() => 'hi').withApply(null));
    const fcText = tableCell.getFormControl(84, 0, tableColumn, dataSample1);
    expect(fcText).toBeTruthy();
    expect(fcText.value).toEqual('hi');
  });
  it('get form errors', () => {
    tableCell.formControls = new Map();
    const validators = [Validators.required, Validators.min(5)];
    tableColumn.withFormField(tableColumn.getNumberFormField()
      .withErrors([
        {key: 'required', msg: 'test required'},
        {key: 'min', msg: 'test min'}
      ])
      .withValidators(validators));
    const formControl = tableCell.getFormControl(0, 0, tableColumn, dataSample1);
    formControl.patchValue(0);
    expect(tableCell.getCurrentErrors(tableColumn, formControl)).toEqual([{key: 'min', msg: 'test min'}]);
    formControl.patchValue(null);
    expect(tableCell.getCurrentErrors(tableColumn, formControl))
      .toEqual([{key: 'required', msg: 'test required'}]);
    formControl.patchValue(420);
    expect(tableCell.getCurrentErrors(tableColumn, formControl)).toEqual([]);
  });
  it('icon name', () => {
    tableColumn.withIcon(() => 'iconname');
    expect(tableCell.getIconName(tableColumn, dataSample1)).toBe('iconname');
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
