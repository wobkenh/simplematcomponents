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
      new ComplexTestData(2, 'test2', new TestData('Key2', 'Value2', d2)),
      new ComplexTestData(3, 'test3', new TestData('Key3', 'Value3', d3)),
    ];
    this.columns = [
      new TableColumn<ComplexTestData, 'id'>('', 'id')
        .withIcon((id) => id < 3 ? 'add' : 'delete')
        .withButton(ButtonType.RAISED)
        .withNgStyle((id) => ({'background-color': id < 3 ? '#992222' : 'transparent'}))
        .isTextHiddenXs(true)
        .withButtonColor('primary'),
      new TableColumn<ComplexTestData, 'description'>('Description', 'description'),
      new TableColumn<ComplexTestData, 'description'>('Description2', 'description')
        .isVisible(false)
        .withAlign(Align.LEFT)
        .withMinLines(3)
        .withMaxLines(3)
        .withOnClick((data) => console.log(data)),
      new TableColumn<ComplexTestData, 'data'>('Key', 'data')
        .withTransform((data) => data.key)
        .withNgClass(() => 'red-bg-cell')
        .isHiddenSm(true)
        .withOnClick((data) => console.log(data)),
      new TableColumn<ComplexTestData, 'data'>('Value', 'data')
        .isHiddenXs(true)
        .withNgStyle(() => ({'background': '#992222', 'color': '#fff'}))
        .withTransform((data) => data.value),
      new TableColumn<ComplexTestData, 'data'>('Datum', 'data')
        .withTransform((data) => this.getDateStr(data.date))
        .withSortTransform(data => data.date.toISOString())
        .withAlign(Align.RIGHT)
    ];
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

}

class TestData {
  constructor(public key: string, public value: string, public date: Date) {
  }
}

class ComplexTestData {
  constructor(public id: number, public description: string, public data: TestData) {
  }
}
