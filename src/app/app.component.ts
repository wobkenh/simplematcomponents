import {Component, OnInit} from '@angular/core';
import {TableColumn} from '../../projects/simplemattable/src/lib/model/table-column.model';

@Component({
  selector: 'smc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'smc';
  testData: TestData[] = [];
  columns: TableColumn<TestData, any>[] = [];

  ngOnInit(): void {
    this.testData = [
      new TestData('Key1', 'Value1'),
      new TestData('Key2', 'Value2'),
      new TestData('Key3', 'Value3'),
    ];
    this.columns = [
      new TableColumn<TestData, 'key'>('Key', 'key')
        .withWidth(100).withTransform(data => data.substring(3)),
      new TableColumn<TestData, 'value'>('Value', 'value')
    ];
  }

}

class TestData {
  constructor(public key: string, public value: string) {
  }
}
