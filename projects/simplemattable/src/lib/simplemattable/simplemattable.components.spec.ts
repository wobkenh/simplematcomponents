import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SimplemattableComponent} from './simplemattable.component';
import {Component, ViewChild} from '@angular/core';
import {TableColumn} from '../model/table-column.model';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatCommonModule,
  MatDatepickerModule,
  MatIconModule,
  MatInputModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSortModule,
  MatTableModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Align} from '../model/align.model';
import {ButtonType} from '../model/button-type.model';
import {LargeTextFormField} from '../model/large-text-form-field.model';
import {SelectFormField} from '../model/select-form-field.model';
import {Height} from '../model/height.model';
import {Width} from '../model/width.model';

describe('TestcompComponent', () => {
  let hostComponent: TestHostComponent;
  let testHostFixture: ComponentFixture<TestHostComponent>;
  let smt: SimplemattableComponent<ComplexTestData>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FlexLayoutModule,
        MatCommonModule,
        FormsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        ReactiveFormsModule,
        MatInputModule,
        MatTableModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        MatSortModule,
        MatIconModule,
        MatSelectModule,
        MatButtonModule,
        BrowserAnimationsModule,
        MatPaginatorModule
      ],
      declarations: [SimplemattableComponent, TestHostComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    testHostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = testHostFixture.componentInstance;
    smt = hostComponent.simplemattable;
    testHostFixture.detectChanges();
  });

  it('should create', () => {
    expect(hostComponent).toBeTruthy();
  });

  it('should apply filter correctly', () => {
    smt.applyFilter(' funny TEsT   ');
    expect(smt.dataSource.filter).toBe('funny test');
  });
  it('should filter correctly', () => {
    const data = new ComplexTestData(1, new TestData('test', 2, new Date()));
    smt.columns = [
      new TableColumn<ComplexTestData, 'id'>('ID', 'id'),
      new TableColumn<ComplexTestData, 'testData'>('Key', 'testData')
        .withTransform(t => t.key),
    ];
    expect(smt.dataSource.filterPredicate(data, 'test')).toBe(true);
    expect(smt.dataSource.filterPredicate(data, '1 test')).toBe(true);
    expect(smt.dataSource.filterPredicate(data, 'Natalie Dormer')).toBe(false);
  });
  it('should col filter correctly', () => {
    const data = new ComplexTestData(1, new TestData('test', 2, new Date()));
    smt.columns = [
      new TableColumn<ComplexTestData, 'id'>('ID', 'id')
        .withColFilter(),
      new TableColumn<ComplexTestData, 'testData'>('Key', 'testData')
        .withTransform(t => t.key)
        .withColFilter(),
    ];
    smt.data = [data];
    smt.ngDoCheck();
    smt.getColFilterFormControl(smt.columns[1]).patchValue('Test');
    expect(smt.dataSource.filterPredicate(data, '')).toBe(true);
    smt.getColFilterFormControl(smt.columns[1]).patchValue('e');
    expect(smt.dataSource.filterPredicate(data, '')).toBe(true);
    smt.getColFilterFormControl(smt.columns[1]).patchValue('Test2');
    expect(smt.dataSource.filterPredicate(data, '')).toBe(false);
    smt.getColFilterFormControl(smt.columns[0]).patchValue('1');
    smt.getColFilterFormControl(smt.columns[1]).patchValue('test');
    expect(smt.dataSource.filterPredicate(data, '')).toBe(true);
  });
  it('should call onClick button clickable', () => {
    const tcolButtonClickable = hostComponent.tcolUnused
      .withOnClick(() => {
      })
      .withButton(ButtonType.BASIC);
    const data = hostComponent.data[0];
    spyOn(tcolButtonClickable, 'onClick');
    smt.onClick(tcolButtonClickable, data, false);
    expect(tcolButtonClickable.onClick).toHaveBeenCalledTimes(0);
    smt.onClick(tcolButtonClickable, data, true);
    expect(tcolButtonClickable.onClick).toHaveBeenCalled();
  });
  it('should call onClick no button clickable', () => {
    const tcolNoButtonClickable = hostComponent.tcolUnused
      .withOnClick(() => {
      });
    const data = hostComponent.data[0];
    spyOn(tcolNoButtonClickable, 'onClick');
    smt.onClick(tcolNoButtonClickable, data, true);
    expect(tcolNoButtonClickable.onClick).toHaveBeenCalledTimes(0);
    // Should not be clickable if currently editing:
    smt.startEditElement(data, 1);
    smt.onClick(tcolNoButtonClickable, data, false);
    expect(tcolNoButtonClickable.onClick).toHaveBeenCalledTimes(0);
    smt.cancelEditElement(data);
    smt.onClick(tcolNoButtonClickable, data, false);
    expect(tcolNoButtonClickable.onClick).toHaveBeenCalledTimes(1);
  });

  it('ngClass plain object', () => {
    const tcol = hostComponent.tcolPlain;
    const data = hostComponent.data[0];
    const res = smt.getCellCssClass(tcol, data);
    expect(res).toEqual({'filler-div': true, 'on-click': undefined});
  });
  it('ngClass clickable', () => {
    const tcol = hostComponent.tcolUnused
      .withOnClick(() => {
      });
    const data = hostComponent.data[0];
    const res = smt.getCellCssClass(tcol, data);
    expect(res).toEqual({'filler-div': true, 'on-click': true});
  });
  it('ngClass button and two classes', () => {
    const tcol = hostComponent.tcolUnused
      .withNgClass(() => 'testclass1 testclass2')
      .withOnClick(() => {
      })
      .withButton(ButtonType.BASIC);
    // no matter how you return it, should always result in the same ngClass
    const data = hostComponent.data[0];
    expect(smt.getCellCssClass(tcol, data)).toEqual({'filler-div': true, 'on-click': false, 'testclass1': true, 'testclass2': true});

    tcol.withNgClass(() => ['testclass1', 'testclass2']);
    expect(smt.getCellCssClass(tcol, data)).toEqual({'filler-div': true, 'on-click': false, 'testclass1': true, 'testclass2': true});

    tcol.withNgClass(() => ({'testclass1': true, 'testclass2': true}));
    expect(smt.getCellCssClass(tcol, data)).toEqual({'filler-div': true, 'on-click': false, 'testclass1': true, 'testclass2': true});
  });
  it('ngClass default style if ngClass returns falsy value', () => {
    const tcol = hostComponent.tcolUnused
      .withNgClass(() => null)
      .withOnClick(() => {
      })
      .withButton(ButtonType.BASIC);
    // ngClassFn gives back nothing --> should return default style
    expect(smt.getCellCssClass(tcol, hostComponent.data[0])).toEqual({'filler-div': true, 'on-click': false});
  });
  it('ngStyle', () => {
    const tcol = hostComponent.tcolUnused;
    const data = hostComponent.data[0];
    expect(smt.getCellCssStyle(tcol, data)).toEqual({'textAlign': 'start', 'minHeight': '48px'});
    const style = {'textAlign': 'start', 'color': '#FFFFFF', 'border': '1px solid black', 'minHeight': '48px'};
    tcol.withNgStyle(() => style);
    expect(smt.getCellCssStyle(tcol, data)).toEqual(style);
  });
  it('ngStyle with height', () => {
    const tcol = hostComponent.tcolUnused;
    tcol.withHeightFn(() => Height.px(30));
    const data = hostComponent.data[0];
    expect(smt.getCellCssStyle(tcol, data)).toEqual({'textAlign': 'start', 'height': '30px'});
    tcol.withHeightFn(() => Height.pct(30));
    expect(smt.getCellCssStyle(tcol, data)).toEqual({'textAlign': 'start', 'height': '30%'});
  });
  it('get form control', () => {
    const tcol = hostComponent.tcolUnused
      .withFormField(hostComponent.tcolUnused.getNumberFormField().withPlaceholder('placeholder').withHint('hint'));
    // new Form Control
    const fc = smt.getFormControl(0, 0, hostComponent.tcolUnused, hostComponent.data[0]);
    expect(fc).toBeTruthy();
    expect(tcol.formField.placeholder).toEqual('placeholder');
    expect(tcol.formField.hint).toEqual('hint');
    // Reload Form Control
    expect(smt.getFormControl(0, 0, hostComponent.tcolUnused, hostComponent.data[0])).toBe(fc);
    // New Form Control with init
    const validators = [Validators.required, Validators.min(5)];
    tcol.withFormField(hostComponent.tcolUnused.getNumberFormField()
      .withInit(() => 420)
      .withValidators(validators));
    const res = smt.getFormControl(42, 0, hostComponent.tcolUnused, hostComponent.data[0]);
    expect(res.value).toBe(420);
    expect(res.valid).toBe(true);
    res.patchValue(2);
    expect(res.valid).toBe(false);
    res.patchValue(null);
    expect(res.valid).toBe(false);
    res.patchValue(100);
    expect(res.valid).toBe(true);

    tcol.withMaxLines(25)
      .withMinLines(5)
      .withFormField(tcol.getLargeTextFormField().withInit(() => 'hi').withApply(null));
    const fcText = smt.getFormControl(84, 0, hostComponent.tcolUnused, hostComponent.data[0]);
    expect(fcText).toBeTruthy();
    expect(fcText.value).toEqual('hi');
  });
  it('is form valid', () => {
    const validators = [Validators.required, Validators.min(5)];
    const tcol = hostComponent.tcolUnused
      .withFormField(hostComponent.tcolUnused.getNumberFormField()
        .withInit(() => 420)
        .withValidators(validators));
    const fc1 = smt.getFormControl(0, 0, tcol, hostComponent.data[0]);
    const fc2 = smt.getFormControl(0, 1, tcol, hostComponent.data[0]);
    expect(smt.isFormValid(0)).toBe(true);
    fc1.patchValue(0);
    expect(smt.isFormValid(0)).toBe(false);
    fc1.patchValue(420);
    // unrelated, invalid form control should not change test results:
    const fc3 = smt.getFormControl(5, 1, tcol, hostComponent.data[0]);
    fc3.patchValue(0);
    expect(smt.isFormValid(0)).toBe(true);
    fc2.patchValue(0);
    expect(smt.isFormValid(0)).toBe(false);
  });
  it('apply col filter', () => {
    smt.dataSource.filter = 'Natalie Dormer';
    smt.applyColFilter();
    expect(smt.dataSource.filter).not.toBe('Natalie Dormer');
    expect(smt.dataSource.filter.startsWith('Natalie Dormer')).toBeTruthy();
    smt.applyColFilter();
    expect(smt.dataSource.filter).toBe('Natalie Dormer');
    smt.dataSource.filter = '';
    smt.applyColFilter();
    expect(smt.dataSource.filter).toBe(' ');
  });
  it('set col filter on tcol', () => {
    const tcol = hostComponent.tcolPlain.withColFilter();
    smt.ngDoCheck();
    expect(smt.colFilterFormControls.get(tcol).value).toBe('');
    tcol.setColFilterText('1');
    expect(smt.dataSource.filter).toBe('');
    smt.ngDoCheck();
    expect(smt.colFilterFormControls.get(tcol).value).toBe('1');
    expect(smt.dataSource.filter).toBe(' '); // str has changed ==> successfully reapplied filter
  });
  it('get form errors', () => {
    const validators = [Validators.required, Validators.min(5)];
    const tcol = hostComponent.tcolUnused
      .withFormField(hostComponent.tcolUnused.getNumberFormField()
        .withErrors([
          {key: 'required', msg: 'test required'},
          {key: 'min', msg: 'test min'}
        ])
        .withValidators(validators));
    const fc = smt.getFormControl(0, 0, tcol, hostComponent.data[0]);
    fc.patchValue(0);
    expect(smt.getCurrentErrors(0, 0, tcol, hostComponent.data[0])).toEqual([{key: 'min', msg: 'test min'}]);
    fc.patchValue(null);
    expect(smt.getCurrentErrors(0, 0, tcol, hostComponent.data[0]))
      .toEqual([{key: 'required', msg: 'test required'}]);
    fc.patchValue(420);
    expect(smt.getCurrentErrors(0, 0, tcol, hostComponent.data[0])).toEqual([]);
  });
  it('start add element', () => {
    const data = new ComplexTestData(4242, new TestData('test', 1, new Date()));
    smt.create = () => data;
    expect(smt.addedItem).toBeFalsy();
    smt.startAddElement();
    expect(smt.addedItem).toBeTruthy();
    expect(smt.data.indexOf(data)).toEqual(-1);
    const status = smt['dataStatus'].get(data);
    expect(status.editing).toBe(true);
    expect(status.added).toBe(true);
  });
  it('start edit element', () => {
    const data = new ComplexTestData(4242, new TestData('test', 1, new Date()));
    expect(smt['dataStatus'].has(data)).toBe(false);
    smt.startEditElement(data, 1);
    expect(smt['dataStatus'].get(data).editing).toBe(true);
  });
  it('save element', () => {
    const data = new ComplexTestData(42, new TestData('shrt', 42, new Date()));
    const tcol = new TableColumn<ComplexTestData, 'testData'>('Key', 'testData');
    tcol.withFormField(tcol.getTextFormField()
      .withInit(testData => testData.key)
      .withValidators(Validators.minLength(5))
      .withApply((newKey, testData) => {
        testData.key = newKey;
        return testData;
      }));
    hostComponent.columns.push(tcol);
    hostComponent.data.push(data);
    hostComponent.data = hostComponent.data.slice(0);
    testHostFixture.detectChanges();
    smt.startEditElement(data, 1);
    testHostFixture.detectChanges();
    spyOn(smt.add, 'emit');
    spyOn(smt.edit, 'emit');
    // Invalid test data --> should not emit
    smt.saveElement(hostComponent.data.length - 1, data);
    expect(smt.add.emit).toHaveBeenCalledTimes(0);
    expect(smt.edit.emit).toHaveBeenCalledTimes(0);
    // Changing value to sth valid --> should emit edit
    data.testData.key = 'not short';
    hostComponent.data = hostComponent.data.slice(0);
    testHostFixture.detectChanges();
    smt.saveElement(hostComponent.data.length - 1, data);
    expect(smt.add.emit).toHaveBeenCalledTimes(0);
    expect(smt.edit.emit).toHaveBeenCalledTimes(1);
    expect(smt.edit.emit).toHaveBeenCalledWith(data);
    expect(smt['dataStatus'].get(data).loading).toBe(true);
    // Adding new (valid) element and saving it --> should emit add
    const newData = new ComplexTestData(420, new TestData('the answer to life, the universe and everything', 42, new Date()));
    smt.create = () => newData;
    smt.startAddElement(); // New element should be at pos 0
    testHostFixture.detectChanges();
    smt.saveElement(0, newData);
    expect(smt.add.emit).toHaveBeenCalledTimes(1);
    expect(smt.add.emit).toHaveBeenCalledWith(newData);
    expect(smt['dataStatus'].get(newData).loading).toBe(true);
  });
  it('cancel edit element', () => {
    const data = new ComplexTestData(42, new TestData('shrt', 42, new Date()));
    const newData = new ComplexTestData(420, new TestData('the answer to life, the universe and everything', 42, new Date()));
    smt.startEditElement(data, 1);
    expect(smt['dataStatus'].get(data).editing).toBe(true);
    smt.cancelEditElement(data);
    expect(smt['dataStatus'].get(data).editing).toBe(false);
    smt.create = () => newData;
    smt.startAddElement();
    smt.cancelEditElement(newData);
    expect(smt.addedItem).toBeFalsy();
    expect(smt.data.indexOf(newData)).toBe(-1);
  });
  it('delete element', () => {
    const data = new ComplexTestData(42, new TestData('shrt', 42, new Date()));
    hostComponent.data.push(data);
    hostComponent.data = hostComponent.data.slice(0);
    testHostFixture.detectChanges();
    spyOn(smt.delete, 'emit');
    smt.deleteElement(data);
    expect(smt.data.indexOf(data)).toBeGreaterThanOrEqual(0); // Should still be there,
    const status = smt['dataStatus'].get(data);
    expect(status.loading).toBe(true);
    expect(status.editing).toBe(false);
    expect(status.added).toBe(false);
    expect(smt.delete.emit).toHaveBeenCalledTimes(1);
    expect(smt.delete.emit).toHaveBeenCalledWith(data);
  });
  it('get string representation', () => {
    const tcol = hostComponent.tcolUnused;
    const data = new ComplexTestData(42, new TestData('4', 2, new Date()));
    expect(smt.getStringRepresentation(tcol, data)).toBe('42');
    data.id = 0; // Check that there is no falsy bug
    expect(smt.getStringRepresentation(tcol, data)).toBe('0');
    data.id = 42;
    tcol.withTransform(id => (id * 2).toString());
    expect(smt.getStringRepresentation(tcol, data)).toBe('84');
    delete data.id;
    tcol.withTransform(null);
    expect(smt.getStringRepresentation(tcol, data)).toBe('');
    tcol.withTransform(id => !id ? 'test' : 'no test');
    expect(smt.getStringRepresentation(tcol, data)).toBe('test');
  });
  it('is clickable functions', () => {
    const tcol = hostComponent.tcolPlain;
    const data = hostComponent.data[0];
    expect(smt['isButtonClickable'](tcol)).toBeFalsy();
    expect(smt['isCellClickable'](tcol, data)).toBeFalsy();
    tcol.withOnClick(() => {
    });
    expect(smt['isButtonClickable'](tcol)).toBeFalsy();
    expect(smt['isCellClickable'](tcol, data)).toBeTruthy();
    tcol.withButton(ButtonType.RAISED);
    expect(smt['isButtonClickable'](tcol)).toBeTruthy();
    expect(smt['isCellClickable'](tcol, data)).toBeFalsy();
    tcol.withButton(null);
    smt.startEditElement(data, 1);
    expect(smt['isButtonClickable'](tcol)).toBeFalsy();
    expect(smt['isCellClickable'](tcol, data)).toBeFalsy();
  });
  it('form field property retriever functions', () => {
    const field = new LargeTextFormField()
      .withMaxLines(42)
      .withMinLines(15);
    expect(smt.getFormFieldMaxLines(field)).toBe(42);
    expect(smt.getFormFieldMinLines(field)).toBe(15);
    const options = [
      {display: 'the answer to life, the universe and everything', value: 42},
      {display: 'evil number', value: 41},
    ];
    const field2 = new SelectFormField()
      .withOptions(options);
    expect(smt.getFormFieldOptions(field2)).toBe(options);
  });
  it('status query functions', () => {
    const data = hostComponent.data[0];
    const tcolPlain = hostComponent.tcolPlain;
    const tcolFormField = new TableColumn<ComplexTestData, 'testData'>('Date', 'testData');
    tcolFormField.withFormField(tcolFormField.getDateFormField()
      .withInit(testData => testData.date)
      .withApply((newDate, testData) => {
        testData.date = newDate;
        return testData;
      }));
    hostComponent.columns.push(tcolFormField);
    testHostFixture.detectChanges();
    expect(smt.isLoading(data)).toBeFalsy();
    expect(smt.isEditing(data)).toBeFalsy();
    expect(smt.isEditingColumn(tcolFormField, data)).toBeFalsy();
    expect(smt.isEditingColumn(tcolPlain, data)).toBeFalsy();
    smt.startEditElement(data, 1);
    expect(smt.isLoading(data)).toBeFalsy();
    expect(smt.isEditing(data)).toBeTruthy();
    expect(smt.isEditingColumn(tcolFormField, data)).toBeTruthy();
    expect(smt.isEditingColumn(tcolPlain, data)).toBeFalsy();
    smt.saveElement(0, data);
    expect(smt.isLoading(data)).toBeTruthy();
    expect(smt.isEditing(data)).toBeTruthy();
    expect(smt.isEditingColumn(tcolFormField, data)).toBeTruthy();
    expect(smt.isEditingColumn(tcolPlain, data)).toBeFalsy();
  });
  it('icon name', () => {
    const data = hostComponent.data[0];
    const tcol = hostComponent.tcolPlain;
    tcol.withIcon(() => 'iconname');
    expect(smt.getIconName(tcol, data)).toBe('iconname');
  });
  it('get displayed cols', () => {
    const tcol = hostComponent.tcolPlain;
    expect(smt.getDisplayedCols([tcol])).toEqual([tcol]);
    tcol.isVisible(false);
    expect(smt.getDisplayedCols([tcol])).toEqual([]);
  });
  it('fxflex and align', () => {
    const tcol = hostComponent.tcolPlain;
    expect(smt.getHeaderFilterAlign(Align.LEFT)).toBe('start end');
    expect(smt.getHeaderFilterAlign(Align.CENTER)).toBe('center end');
    expect(smt.getHeaderFilterAlign(Align.RIGHT)).toBe('end end');
    expect(smt.getHeaderNoFilterAlign(Align.LEFT)).toBe('start center');
    expect(smt.getHeaderNoFilterAlign(Align.CENTER)).toBe('center center');
    expect(smt.getHeaderNoFilterAlign(Align.RIGHT)).toBe('end center');
    expect(smt.getCellAlign(Align.LEFT)).toBe('start center');
    expect(smt.getCellAlign(Align.CENTER)).toBe('center center');
    expect(smt.getCellAlign(Align.RIGHT)).toBe('end center');
    expect(smt.getTextAlign(Align.LEFT)).toBe('start');
    expect(smt.getTextAlign(Align.CENTER)).toBe('center');
    expect(smt.getTextAlign(Align.RIGHT)).toBe('end');
    tcol.withAlign(Align.CENTER);
    expect(smt.isCenterAlign(tcol)).toBe(true);
    tcol.withAlign(Align.LEFT);
    expect(smt.isCenterAlign(tcol)).toBe(false);
    tcol.withAlign(Align.RIGHT);
    expect(smt.isCenterAlign(tcol)).toBe(false);
    tcol.withAlign(Align.CENTER);
    expect(smt.isLeftAlign(tcol)).toBe(false);
    tcol.withAlign(Align.LEFT);
    expect(smt.isLeftAlign(tcol)).toBe(true);
    tcol.withAlign(Align.RIGHT);
    expect(smt.isLeftAlign(tcol)).toBe(false);
  });
  it('array to object, iterator to array, deep copy', () => {
    // array to object
    const arr = ['42a', '42b'];
    expect(smt.arrayToObject(arr)).toEqual({'42a': true, '42b': true});
    expect(smt.arrayToObject([])).toEqual({});
    // iterator to array
    const map = new Map();
    map.set('test', 42);
    map.set('no test', 43);
    expect(smt.iteratorToArray(map.entries())).toEqual([['test', 42], ['no test', 43]]);
    const map2 = new Map();
    expect(smt.iteratorToArray(map2.entries())).toEqual([]);
    // deep copy
    expect(smt.deepCopy('test')).toEqual('test');
    const date = new Date();
    expect(smt.deepCopy(date)).toEqual(date);
    const obj = {date: date, testData: {testData: new TestData('test', 42, new Date()), arr: ['test', 'another test']}};
    const deepCopy = smt.deepCopy(obj);
    expect(deepCopy).toEqual(obj);
    expect(deepCopy).not.toBe(obj);
  });
  it('dirty checking / dynamic updating: data', () => {
    const data = new ComplexTestData(42, new TestData('42', 42, new Date()));
    smt.create = () => data;
    const dataLength = smt.data.length;
    smt.matSort.active = '0_id';
    smt.matSort.direction = 'asc';
    smt.startAddElement();
    expect(smt.data.length).toBe(dataLength);
    expect(smt.addedItem).toBeTruthy();
    hostComponent.data = hostComponent.data.slice(0);
    testHostFixture.detectChanges();
    // should clear added entry after data has been updated:
    expect(smt.data.length).toBe(dataLength);
    expect(smt.addedItem).toBeFalsy();
    // should not clear sorting selection on data change
    expect(smt.matSort.direction).toBe('asc');
  });
  it('dirty checking / dynamic updating: columns', () => {
    const data = new ComplexTestData(42, new TestData('42', 42, new Date()));
    const existingData = hostComponent.data[0];
    const tcolForm = new TableColumn<ComplexTestData, 'testData'>('TestData', 'testData');
    tcolForm.withFormField(tcolForm.getTextFormField());
    smt.create = () => data;
    const dataLength = smt.data.length;
    smt.matSort.active = '0_id';
    smt.matSort.direction = 'asc';
    smt.startEditElement(existingData, 1);
    smt.startAddElement();
    expect(smt.data.length).toBe(dataLength);
    expect(smt.addedItem).toBeTruthy();
    hostComponent.columns[0].isVisible(false);
    testHostFixture.detectChanges();
    // should clear added entry after cols have been updated:
    expect(smt.data.length).toBe(dataLength);
    expect(smt.addedItem).toBeFalsy();
    // column 0 should be invisible now
    expect(smt.getDisplayedCols(smt.columns).length).toBe(hostComponent.columns.length - 1);
    // should clear sorting selection on col change
    expect(smt.matSort.direction).toBe('');
    // should no longer be editing
    expect(smt.isEditing(existingData)).toBe(false);
  });
  it('get table cell style', () => {
    const tcol = hostComponent.tcolUnused;
    tcol.withWidth(Width.px(50));
    expect(smt.getTableCellStyle(tcol)).toEqual({'width': '50px'});
    tcol.withWidth(Width.pct(50));
    expect(smt.getTableCellStyle(tcol)).toEqual({'width': '50%'});
  });
  it('get table header style col filter', () => {
    expect(smt.getTableHeaderStyle()).toEqual({});
    hostComponent.tcolPlain
      .withColFilter();
    expect(smt.getTableHeaderStyle()).toEqual({'height': '100%'});
  });


  @Component({
    selector: `smc-host-component`,
    template: `
      <smc-simplemattable [data]="data" [columns]="columns"></smc-simplemattable>`
  })
  class TestHostComponent {
    @ViewChild(SimplemattableComponent) simplemattable: SimplemattableComponent<ComplexTestData>;
    tcolPlain = new TableColumn<ComplexTestData, 'id'>('ID', 'id');
    tcolUnused = new TableColumn<ComplexTestData, 'id'>('ID', 'id');
    columns: TableColumn<ComplexTestData, any>[] = [
      this.tcolPlain
    ];
    data = [
      new ComplexTestData(1, new TestData('test', 2, new Date()))
    ];
  }

});

describe('TestcompComponent', () => {
  let hostComponent: TestFullHostComponent;
  let testHostFixture: ComponentFixture<TestFullHostComponent>;
  let smt: SimplemattableComponent<ComplexTestData>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FlexLayoutModule,
        MatCommonModule,
        FormsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        ReactiveFormsModule,
        MatInputModule,
        MatTableModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        MatSortModule,
        MatIconModule,
        MatSelectModule,
        MatButtonModule,
        BrowserAnimationsModule,
        MatPaginatorModule
      ],
      declarations: [SimplemattableComponent, TestFullHostComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    testHostFixture = TestBed.createComponent(TestFullHostComponent);
    hostComponent = testHostFixture.componentInstance;
    smt = hostComponent.simplemattable;
    testHostFixture.detectChanges();
  });

  it('simplemattable edit mode enabled', () => {
    expect(function () {
      hostComponent.data = hostComponent.data.slice(0);
      testHostFixture.detectChanges();
    }).not.toThrow();
  });

  @Component({
    selector: `smc-host-component-full`,
    template: `
      <smc-simplemattable [data]="data" [columns]="columns" [sorting]="true" [paginator]="true" [filter]="true"
                          [addable]="true" [editable]="true" [deletable]="true" [create]="createFn"></smc-simplemattable>`
  })
  class TestFullHostComponent {
    @ViewChild(SimplemattableComponent) simplemattable: SimplemattableComponent<ComplexTestData>;
    tcolPlain = new TableColumn<ComplexTestData, 'id'>('ID', 'id');
    columns: TableColumn<ComplexTestData, any>[] = [
      this.tcolPlain
    ];
    data = [
      new ComplexTestData(1, new TestData('test', 2, new Date()))
    ];

    createFn() {
      return new ComplexTestData(1, new TestData('test', 2, new Date()));
    }
  }
});

describe('TestcompComponent', () => {
  let hostComponent: TestErrorHostComponent;
  let testHostFixture: ComponentFixture<TestErrorHostComponent>;
  let smt: SimplemattableComponent<ComplexTestData>;

  it('simplemattable add but no create should throw Error', () => {
    const fn = () => {
      TestBed.configureTestingModule({
        imports: [
          CommonModule,
          FlexLayoutModule,
          MatCommonModule,
          FormsModule,
          MatDatepickerModule,
          MatNativeDateModule,
          ReactiveFormsModule,
          MatInputModule,
          MatTableModule,
          MatCheckboxModule,
          MatProgressSpinnerModule,
          MatSortModule,
          MatIconModule,
          MatSelectModule,
          MatButtonModule,
          BrowserAnimationsModule,
          MatPaginatorModule
        ],
        declarations: [SimplemattableComponent, TestErrorHostComponent]
      })
        .compileComponents();
      testHostFixture = TestBed.createComponent(TestErrorHostComponent);
      hostComponent = testHostFixture.componentInstance;
      smt = hostComponent.simplemattable;
      testHostFixture.detectChanges();
    };
    expect(fn).toThrowError();
  });

  @Component({
    selector: `smc-host-component-error`,
    template: `
      <smc-simplemattable [data]="data" [columns]="columns" [addable]="true"></smc-simplemattable>`
  })
  class TestErrorHostComponent {
    @ViewChild(SimplemattableComponent) simplemattable: SimplemattableComponent<ComplexTestData>;
    tcolPlain = new TableColumn<ComplexTestData, 'id'>('ID', 'id');
    columns: TableColumn<ComplexTestData, any>[] = [
      this.tcolPlain
    ];
    data = [
      new ComplexTestData(1, new TestData('test', 2, new Date()))
    ];
  }
});

class ComplexTestData {
  constructor(public id: number, public testData: TestData) {
  }
}

class TestData {
  constructor(public key: string, public value: number, public date: Date) {
  }
}
