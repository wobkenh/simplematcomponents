import {Component, OnInit} from '@angular/core';
import {TableColumn} from '../../projects/simplemattable/src/lib/model/table-column.model';

@Component({
  selector: 'smc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'smc';
  testData: ComplexTestData[] = [];
  columns = [];

  ngOnInit(): void {
    this.testData = [
      new ComplexTestData(1, 'test1', new TestData('Key1', 'Value1')),
      new ComplexTestData(2, 'test2', new TestData('Key2', 'Value2')),
      new ComplexTestData(3, 'test3', new TestData('Key3', 'Value3')),
    ];
    this.columns = [
      new TableColumn<ComplexTestData, 'description'>('Description', 'description'),
      new TableColumn<ComplexTestData, 'data'>('Key', 'data', (data) => data.key),
      new TableColumn<ComplexTestData, 'data'>('Value', 'data', (data) => data.value)
    ];
  }

}

class TestData {
  constructor(public key: string, public value: string) {
  }
}

class ComplexTestData {
  constructor(public id: number, public description: string, public data: TestData) {
  }
}
