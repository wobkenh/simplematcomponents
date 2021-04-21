import { Component, OnInit } from '@angular/core';
import { TableColumn } from 'projects/simplemattable/src/public_api';
import { ComplexTestData, TestData } from '../model/test-data.model';

@Component({
  selector: 'smc-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {

  // Filter
  dataFilter: ComplexTestData[] = [];
  columnsFilter: TableColumn<any, any>[] = [];
  typescriptData = `this.dataFilter = [
  new ComplexTestData(1, 40, 'search for me test1', new TestData('Key1', 'Value1', d1), 'test2'),
  new ComplexTestData(2, 42, 'or for me test2', new TestData('Key2', 'Value2', d2), 'test3')
];`;
  typescriptColumns = `this.columnsFilter = [
  new TableColumn<ComplexTestData, 'id'>('My ID', 'id'),
  new TableColumn<ComplexTestData, 'description'>('My Description with column filter', 'description')
    .withColFilter(),
  new TableColumn<ComplexTestData, 'data'>('Nested Value with column filter', 'data')
    .withTransform(data => data.value)
    .withColFilter(),
  new TableColumn<ComplexTestData, 'description'>('Custom Filter will always return test1', 'description')
    // This just listens to the search inputs of the user
    .withSearch((searchInput) => {
      console.log('The user searched for: ' + searchInput);
    })
    // This actually replaces the filter logic
    .withFilter(((searchInput, data) => {
      return data.includes('test1');
    }))
    .withColFilter(),
];`;
  html = `<smc-simplemattable [data]="dataFilter" [columns]="columnsFilter" [filter]="true"></smc-simplemattable>`;

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
      Filter Table
    */
    this.dataFilter = [
      new ComplexTestData(1, 40, 'search for me test1', new TestData('Key1', 'Value1', d1), 'test2'),
      new ComplexTestData(2, 42, 'or for me test2', new TestData('Key2', 'Value2', d2), 'test3')
    ];
    this.columnsFilter = [
      new TableColumn<ComplexTestData, 'id'>('My ID', 'id'),
      new TableColumn<ComplexTestData, 'description'>('My Description with column filter', 'description')
        .withColFilter(),
      new TableColumn<ComplexTestData, 'data'>('Nested Value with column filter', 'data')
        .withTransform(data => data.value)
        .withColFilter(),
      new TableColumn<ComplexTestData, 'description'>('Custom Filter will always return test1', 'description')
        // This just listens to the search inputs of the user
        .withSearch((searchInput) => {
          console.log('The user searched for: ' + searchInput);
        })
        // This actually replaces the filter logic
        .withFilter(((searchInput, data) => {
          return data.includes('test1');
        }))
        .withColFilter(),
    ];
  }

}
