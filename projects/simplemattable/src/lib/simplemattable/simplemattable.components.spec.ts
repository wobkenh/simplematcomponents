import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SimplemattableComponent} from './simplemattable.component';
import {Component, ViewChild} from '@angular/core';
import {TableColumn} from '../model/table-column.model';
import {
  MatButtonModule, MatCommonModule, MatDatepickerModule,
  MatIconModule, MatInputModule,
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
import {FormError} from '../model/form-error.model';

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

  it('should return correct align', () => {
    expect(smt.getAlign(Align.LEFT)).toBe('start center');
    expect(smt.getAlign(Align.CENTER)).toBe('center center');
    expect(smt.getAlign(Align.RIGHT)).toBe('end center');
  });
  it('should return correct text align', () => {
    expect(smt.getTextAlign(Align.LEFT)).toBe('start');
    expect(smt.getTextAlign(Align.CENTER)).toBe('center');
    expect(smt.getTextAlign(Align.RIGHT)).toBe('end');
  });
  it('should apply filter correctly', () => {
    smt.applyFilter(' funny TEsT   ');
    expect(smt.dataSource.filter).toBe('funny test');
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
    smt.startEditElement(data);
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
    expect(res).toEqual({'on-click': undefined});
  });
  it('ngClass clickable', () => {
    const tcol = hostComponent.tcolUnused
      .withOnClick(() => {
      });
    const data = hostComponent.data[0];
    const res = smt.getCellCssClass(tcol, data);
    expect(res).toEqual({'on-click': true});
  });
  it('ngClass button and two classes', () => {
    const tcol = hostComponent.tcolUnused
      .withNgClass(() => 'testclass1 testclass2')
      .withOnClick(() => {
      })
      .withButton(ButtonType.BASIC);
    // no matter how you return it, should always result in the same ngClass
    const data = hostComponent.data[0];
    expect(smt.getCellCssClass(tcol, data)).toEqual({'on-click': false, 'testclass1': true, 'testclass2': true});

    tcol.withNgClass(() => ['testclass1', 'testclass2']);
    expect(smt.getCellCssClass(tcol, data)).toEqual({'on-click': false, 'testclass1': true, 'testclass2': true});

    tcol.withNgClass(() => ({'testclass1': true, 'testclass2': true}));
    expect(smt.getCellCssClass(tcol, data)).toEqual({'on-click': false, 'testclass1': true, 'testclass2': true});
  });
  it('ngClass default style if ngClass returns falsy value', () => {
    const tcol = hostComponent.tcolUnused
      .withNgClass(() => null)
      .withOnClick(() => {
      })
      .withButton(ButtonType.BASIC);
    // ngClassFn gives back nothing --> should return default style
    expect(smt.getCellCssClass(tcol, hostComponent.data[0])).toEqual({'on-click': false});
  });
  it('ngStyle', () => {
    const tcol = hostComponent.tcolUnused;
    const data = hostComponent.data[0];
    expect(smt.getCellCssStyle(tcol, data)).toEqual({});
    const style = {'color': '#FFFFFF', 'border': '1px solid black'};
    tcol.withNgStyle(() => style);
    expect(smt.getCellCssStyle(tcol, data)).toEqual(style);
  });
  it('get form control', () => {
    const tcol = hostComponent.tcolUnused
      .withFormField(hostComponent.tcolUnused.getNumberFormField());
    // new Form Control
    const fc = smt.getFormControl(0, 0, hostComponent.tcolUnused, hostComponent.data[0]);
    expect(fc).toBeTruthy();
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

  @Component({
    selector: `smc-host-component`,
    template: `
      <smc-simplemattable [data]="data" [columns]="columns"></smc-simplemattable>`
  })
  class TestHostComponent {
    @ViewChild(SimplemattableComponent) simplemattable: SimplemattableComponent<ComplexTestData>;
    tcolPlain = new TableColumn<ComplexTestData, 'id'>('ID', 'id');
    tcolUnused = new TableColumn<ComplexTestData, 'id'>('ID', 'id');
    columns = [
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
