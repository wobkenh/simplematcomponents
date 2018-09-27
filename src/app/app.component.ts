import {Component, OnInit} from '@angular/core';
import {TableColumn} from '../../projects/simplemattable/src/lib/model/table-column.model';
import {AlertType} from '../../projects/simplealert/src/simplealert/alert-type.model';
import {Align} from '../../projects/simplemattable/src/lib/model/align.model';
import {ButtonType} from '../../projects/simplemattable/src/lib/model/button-type.model';
import {Width} from '../../projects/simplemattable/src/lib/model/width.model';
import {AbstractControl, Validators} from '@angular/forms';

@Component({
  selector: 'smc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  testData: ComplexTestData[];
  columns: TableColumn<any, any>[] = [];
  isInfoOpen = true;
  isErrorOpen = true;
  isWarnOpen = true;
  isSuccessOpen = true;
  alertType = AlertType;
  id = 42;

  ngOnInit(): void {
    const d1 = new Date();
    d1.setDate(20);
    d1.setMonth(1);
    d1.setFullYear(2018);
    const d2 = new Date();
    d2.setDate(15);
    d2.setMonth(7);
    d2.setFullYear(2017);
    const d3 = new Date();
    d3.setDate(4);
    d3.setMonth(3);
    d3.setFullYear(2017);
    this.testData = [
      new ComplexTestData(1, 40, 'test1', new TestData('Key1', 'Value1', d1)),
      new ComplexTestData(2, 41, '', new TestData('Key2', 'Value2', d2)),
      new ComplexTestData(3, 39, 'test3', new TestData('Key3', 'Value3', d3)),
      new ComplexTestData(4, 39, 'test3', new TestData('Key3', 'Value3', d3)),
      new ComplexTestData(5, 39, 'test3', new TestData('Key3', 'Value3', d3)),
      new ComplexTestData(6, 39, 'test3', new TestData('Key3', 'Value3', d3)),
      new ComplexTestData(7, 39, 'test3', new TestData('Key3', 'Value3', d3)),
      new ComplexTestData(1, 40, 'test1', new TestData('Key1', 'Value1', d1)),
      new ComplexTestData(2, 41, '', new TestData('Key2', 'Value2', d2)),
      new ComplexTestData(3, 39, 'test3', new TestData('Key3', 'Value3', d3)),
      new ComplexTestData(4, 39, 'test3', new TestData('Key3', 'Value3', d3)),
      new ComplexTestData(5, 39, 'test3', new TestData('Key3', 'Value3', d3)),
      new ComplexTestData(6, 39, 'test3', new TestData('Key3', 'Value3', d3)),
      new ComplexTestData(7, 39, 'test3', new TestData('Key3', 'Value3', d3))
    ];

    const idCol = new TableColumn<ComplexTestData, 'id'>('ID with button', 'id')
      .withIcon((id) => id < 3 ? 'add' : 'delete')
      .withButton(ButtonType.RAISED)
      .withButtonColor('primary')
      .withWidth(Width.px(125))
      .isTextHiddenXs(true);
    const desCol = new TableColumn<ComplexTestData, 'description'>('Description', 'description');
    const valueCol = new TableColumn<ComplexTestData, 'value'>('Number with select', 'value');
    valueCol.withFormField(valueCol.getSelectFormField<number>()
      .withOptions([
        {display: '39', value: 39},
        {display: '40', value: 40},
        {display: '41', value: 41},
        {display: 'eine lustige Zahl', value: 420}
      ])
      .withValidators([Validators.required, Validators.min(25)])
      .withErrors([
        {key: 'required', msg: 'Value is required!'},
        {key: 'min', msg: 'Value should be at least 25!'}
      ]));
    const testErrorCol = new TableColumn<ComplexTestData, 'data'>('Profile', 'data')
      .withTransform(data => data.value);
    testErrorCol.withFormField(testErrorCol.getSelectFormField<string>()
      .withOptions([
        {display: 'Valideur', value: 'Valideur'},
        {display: 'Pilote', value: 'Pilote'},
        {display: 'Admin', value: 'Admin'},
        {display: 'Operateur', value: 'Operateur'},
      ]).withPlaceholder('Profil'));
    const des2Col = new TableColumn<ComplexTestData, 'description'>('Description2', 'description')
      .isVisible(false)
      .withAlign(Align.LEFT)
      .withMinLines(3)
      .withMaxLines(3)
      .withOnClick((data) => console.log(data));
    des2Col.withFormField(des2Col.getLargeTextFormField().withHint('Hier steht ein langer Text'));
    const keyCol = new TableColumn<ComplexTestData, 'data'>('Key', 'data')
      .withTransform((data) => data.key)
      .isHiddenSm(true)
      .withOnClick((data) => console.log(data));
    keyCol.withFormField(keyCol.getTextFormField()
      .withFocus(true)
      .withInit((data) => data.key)
      .withApply((id, data) => {
        data.key = id;
        return data;
      }));
    const valCol = new TableColumn<ComplexTestData, 'data'>('Value with icon', 'data')
      .isHiddenXs(true)
      .withNgClass(() => 'red-bg-cell')
      .withIcon(() => 'menu')
      .withTransform((data) => data.value);
    const dateCol = new TableColumn<ComplexTestData, 'data'>('Date right align', 'data')
      .withTransform((data) => this.getDateStr(data.date))
      .withSortTransform(data => data.date.toISOString())
      .withAlign(Align.RIGHT);
    dateCol.withFormField(dateCol.getDateFormField()
      .withHint('Only past dates.')
      .withPlaceholder('Date')
      .withErrors([
        {key: 'required', msg: 'Date is required!'},
        {key: 'pastDate', msg: 'Date needs to be in the past!'}
      ])
      .withValidators([Validators.required, this.pastDateValidator])
      .withInit(data => data.date)
      .withApply((val, data) => {
        data.date = val;
        return data;
      })
    );
    this.columns = [idCol, testErrorCol, desCol, des2Col, valueCol, keyCol, valCol, dateCol];
  }

  pastDateValidator = (control: AbstractControl) => control.value < new Date() ? null : {'pastDate': true};


  toggleVisibility() {
    this.columns[2].visible = !this.columns[2].visible;
  }

  addEntry() {
    this.testData.push(new ComplexTestData(42, 420, 'New Entry with a lot of text that is very long like really really long ' +
      'i mean really really long i really mean it', new TestData('key', 'value', new Date())));
    this.testData = this.testData.slice(0);
  }

  getDateStr = (date: Date) => (date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()) + '.' +
    (date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '.' + date.getFullYear();

  openInfo() {
    this.isInfoOpen = true;
  }

  openError() {
    this.isErrorOpen = true;
  }

  openWarn() {
    this.isWarnOpen = true;
  }

  openSuccess() {
    this.isSuccessOpen = true;
  }

  onDelete(element: ComplexTestData) {
    setTimeout(() => {
      const index = this.testData.indexOf(element);
      if (index >= 0) {
        this.testData.splice(index, 1);
        this.testData = this.testData.slice(0);
      }
    }, 2000);
  }

  onEdit(element: ComplexTestData) {
    setTimeout(() => {
      this.testData[this.testData.findIndex(ele => ele.id === element.id)] = element;
      console.log('edit');
      console.log(element);
      this.testData = this.testData.slice(0);
    }, 2000);
  }

  onAdd(element: ComplexTestData) {
    setTimeout(() => {
      element.id = this.id++;
      this.testData.push(element);
      console.log('add');
      console.log(element);
      this.testData = this.testData.slice(0);
    }, 2000);
  }

  createFn(): ComplexTestData {
    return new ComplexTestData(0, 42, '', new TestData('', '', new Date()));
  }

}

class TestData {
  constructor(public key: string, public value: string, public date: Date) {
  }
}

class ComplexTestData {
  constructor(public id: number, public value: number, public description: string, public data: TestData) {
  }
}
