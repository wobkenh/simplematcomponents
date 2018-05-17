import {Component, OnInit} from '@angular/core';
import {TableColumn} from '../../projects/simplemattable/src/lib/model/table-column.model';
import {AlertType} from '../../projects/simplealert/src/simplealert/alert-type.model';
import {Align} from '../../projects/simplemattable/src/lib/model/align.model';
import {ButtonType} from '../../projects/simplemattable/src/lib/model/button-type.model';
import {Width} from '../../projects/simplemattable/src/lib/model/width.model';

@Component({
  selector: 'smc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  testData: ComplexTestData[] = [];
  columns: TableColumn<any, any>[] = [];
  isInfoOpen = true;
  isErrorOpen = true;
  alertType = AlertType;

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
      new ComplexTestData(1, 'test1', new TestData('Key1', 'Value1', d1)),
      new ComplexTestData(2, '', new TestData('Key2', 'Value2', d2)),
      new ComplexTestData(3, 'test3', new TestData('Key3', 'Value3', d3)),
    ];

    const idCol = new TableColumn<ComplexTestData, 'id'>('', 'id')
      .withIcon((id) => id < 3 ? 'add' : 'delete')
      .withButton(ButtonType.RAISED)
      .withButtonColor('primary')
      .withNgStyle((id) => ({'background-color': id < 3 ? '#992222' : 'transparent'}))
      .isTextHiddenXs(true);
    const desCol = new TableColumn<ComplexTestData, 'description'>('Description', 'description');
    const des2Col = new TableColumn<ComplexTestData, 'description'>('Description2', 'description')
      .isVisible(false)
      .withAlign(Align.LEFT)
      .withMinLines(3)
      .withMaxLines(3)
      .withOnClick((data) => console.log(data));
    const keyCol = new TableColumn<ComplexTestData, 'data'>('Key', 'data')
      .withTransform((data) => data.key)
      .isHiddenSm(true)
      .withOnClick((data) => console.log(data));
    keyCol.withFormField(keyCol.getTextFormField()
      .withInit((data) => data.key)
      .withApply((id, data) => {
        data.key = id;
        return data;
      }));
    const valCol = new TableColumn<ComplexTestData, 'data'>('Value', 'data')
      .isHiddenXs(true)
      .withNgClass(() => 'red-bg-cell')
      .withTransform((data) => data.value);
    const dateCol = new TableColumn<ComplexTestData, 'data'>('Datum', 'data')
      .withTransform((data) => this.getDateStr(data.date))
      .withSortTransform(data => data.date.toISOString())
      .withAlign(Align.RIGHT);
    dateCol.withFormField(keyCol.getDateFormField()
      .withInit(data => data.date)
      .withApply((val, data) => data.date = val));
    this.columns = [idCol, desCol, des2Col, keyCol, valCol, dateCol];
  }

  toggleVisibility() {
    this.columns[2].visible = !this.columns[2].visible;
  }

  addEntry() {
    this.testData.push(new ComplexTestData(42, 'New Entry with a lot of text that is very long like really really long ' +
      'i mean really really long i really mean it', new TestData('key', 'value', new Date())));
    this.testData = this.testData.slice(0);
  }

  getDateStr = (date: Date) => date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();

  openInfo() {
    this.isInfoOpen = true;
  }

  openError() {
    this.isErrorOpen = true;
  }

  onDelete(element: ComplexTestData) {
    const index = this.testData.indexOf(element);
    if (index >= 0) {
      this.testData.splice(index, 1);
      this.testData = this.testData.slice(0);
    }
  }

  onEdit(element: ComplexTestData) {
    this.testData[this.testData.findIndex(ele => ele.id === element.id)] = element;
    console.log(element);
    this.testData = this.testData.slice(0);
  }

  onAdd(element: ComplexTestData) {
    this.testData.push(element);
    console.log('add');
    console.log(element);
    this.testData = this.testData.slice(0);
  }

  createFn(): ComplexTestData {
    return new ComplexTestData(0, '', new TestData('', '', new Date()));
  }

}

class TestData {
  constructor(public key: string, public value: string, public date: Date) {
  }
}

class ComplexTestData {
  constructor(public id: number, public description: string, public data: TestData) {
  }
}
