import {Component, OnInit} from '@angular/core';
import {ComplexTestData, TestData} from '../model/test-data.model';
import {TableColumn} from 'projects/simplemattable/src/public_api';

@Component({
  selector: 'smc-transform',
  templateUrl: './transform.component.html',
  styleUrls: ['./transform.component.css']
})
export class TransformComponent implements OnInit {

  // Transform Table
  dataTransform: ComplexTestData[] = [];
  columnsTransform: TableColumn<any, any>[] = [];
  typescriptData = `const d1 = new Date();
d1.setDate(20);
d1.setMonth(1);
d1.setFullYear(2018);
const d2 = new Date();
d2.setDate(15);
d2.setMonth(7);
d2.setFullYear(2017);
/*
  Transform Table
*/
this.dataTransform = [
  new ComplexTestData(1, 40, 'test1', new TestData('Key1', 'Value1', d1), 'test2'),
  new ComplexTestData(2, 42, 'test2', new TestData('Key2', 'Value2', d2), 'test3')
];`;
  typescriptColumns = `this.columnsTransform = [
  new TableColumn<ComplexTestData, 'id'>('My ID', 'id'),
  new TableColumn<ComplexTestData, 'value'>('My Value', 'value'),
  new TableColumn<ComplexTestData, 'value'>('My Value * 2', 'value')
    .withTransform((data) => (data * 2).toString()),
  new TableColumn<ComplexTestData, 'data'>('Nested Value', 'data')
    .withTransform((data) => data.value)
];`;
  html = `<smc-simplemattable [data]="dataTransform" [columns]="columnsTransform"></smc-simplemattable>`;

  constructor() {
  }

  ngOnInit() {
    const d1 = new Date();
    d1.setDate(20);
    d1.setMonth(1);
    d1.setFullYear(2018);
    const d2 = new Date();
    d2.setDate(15);
    d2.setMonth(7);
    d2.setFullYear(2017);
    /*
      Transform Table
    */
    this.dataTransform = [
      new ComplexTestData(1, 40, 'test1', new TestData('Key1', 'Value1', d1), 'test2'),
      new ComplexTestData(2, 42, 'test2', new TestData('Key2', 'Value2', d2), 'test3')
    ];
    this.columnsTransform = [
      new TableColumn<ComplexTestData, 'id'>('My ID', 'id'),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value'),
      new TableColumn<ComplexTestData, 'value'>('My Value * 2', 'value')
        .withTransform((data) => (data * 2).toString()),
      new TableColumn<ComplexTestData, 'data'>('Nested Value', 'data')
        .withTransform((data) => data.value)
    ];
  }

}
