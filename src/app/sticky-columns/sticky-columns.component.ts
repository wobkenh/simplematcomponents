import { Component, OnInit } from '@angular/core';
import { ComplexTestData } from '../model/test-data.model';
import { TableColumn } from '../../../projects/simplemattable/src/lib/model/table-column.model';

@Component({
  selector: 'smc-sticky-columns',
  templateUrl: './sticky-columns.component.html',
  styleUrls: ['./sticky-columns.component.css'],
  standalone: false
})
export class StickyColumnsComponent implements OnInit {

  // Simple Table
  dataSimple: ComplexTestData[] = [];
  columnsSimple: TableColumn<any, any>[] = [];
  typescriptData = `this.dataSimple = [
  new ComplexTestData(1000000, 400000000, 'test1', null, 'test2'),
  new ComplexTestData(2, 42, 'test2', null, 'test3'),
  new ComplexTestData(3, 43, 'test2', null, 'test3'),
  new ComplexTestData(4, 44, 'test2', null, 'test3'),
  new ComplexTestData(5, 45, 'test2', null, 'test3')
];`;
  typescriptColumns = `this.columnsSimple = [
  new TableColumn<ComplexTestData, 'id'>('My ID', 'id'),
  new TableColumn<ComplexTestData, 'value'>('My Value My Value', 'value')
    .isSticky(true),
  new TableColumn<ComplexTestData, 'value'>('My Value', 'value'),
  new TableColumn<ComplexTestData, 'value'>('My Value', 'value'),
  new TableColumn<ComplexTestData, 'value'>('My Value', 'value'),
  new TableColumn<ComplexTestData, 'value'>('My Value', 'value'),
  new TableColumn<ComplexTestData, 'value'>('My Value', 'value'),
  new TableColumn<ComplexTestData, 'value'>('My Value', 'value'),
  new TableColumn<ComplexTestData, 'value'>('My Value', 'value'),
  new TableColumn<ComplexTestData, 'value'>('My Value', 'value'),
  new TableColumn<ComplexTestData, 'value'>('My Value', 'value'),
  new TableColumn<ComplexTestData, 'value'>('My Value', 'value'),
  new TableColumn<ComplexTestData, 'value'>('My Value', 'value'),
  new TableColumn<ComplexTestData, 'value'>('My Value', 'value'),
  new TableColumn<ComplexTestData, 'value'>('My Value', 'value'),
  new TableColumn<ComplexTestData, 'value'>('My Value', 'value'),
  new TableColumn<ComplexTestData, 'value'>('My Value', 'value'),
  new TableColumn<ComplexTestData, 'value'>('My Value', 'value'),
  new TableColumn<ComplexTestData, 'value'>('My Value', 'value'),
  new TableColumn<ComplexTestData, 'value'>('My Value', 'value')
];`;
  html = `<smc-simplemattable [data]="dataSimple" [columns]="columnsSimple" [stickyButtons]="true"
                    [editable]="true"></smc-simplemattable>`;

  constructor() {
  }

  ngOnInit() {
    /*
        Simple Table
     */
    this.dataSimple = [
      new ComplexTestData(1000000, 400000000, 'test1', null, 'test2'),
      new ComplexTestData(2, 42, 'test2', null, 'test3'),
      new ComplexTestData(3, 43, 'test2', null, 'test3'),
      new ComplexTestData(4, 44, 'test2', null, 'test3'),
      new ComplexTestData(5, 45, 'test2', null, 'test3')
    ];
    this.columnsSimple = [
      new TableColumn<ComplexTestData, 'id'>('My ID', 'id'),
      new TableColumn<ComplexTestData, 'value'>('My Value My Value', 'value')
        .isSticky(true),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value'),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value'),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value'),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value'),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value'),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value'),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value'),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value'),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value'),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value'),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value'),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value'),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value'),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value'),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value'),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value'),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value'),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value')
    ];
  }

}
