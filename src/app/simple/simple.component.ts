import { Component, OnInit } from '@angular/core';
import { ComplexTestData } from '../model/test-data.model';
import { TableColumn } from 'projects/simplemattable/src/public_api';

@Component({
  selector: 'smc-simple',
  templateUrl: './simple.component.html',
  styleUrls: ['./simple.component.css'],
  standalone: false
})
export class SimpleComponent implements OnInit {
  // Simple Table
  dataSimple: ComplexTestData[] = [];
  columnsSimple: TableColumn<any, any>[] = [];

  // Code
  typescriptData = 'this.dataSimple = [\n' +
    '  new ComplexTestData(1, 40, \'test1\', null, \'test2\'),\n' +
    '  new ComplexTestData(2, 42, \'test2\', null, \'test3\')\n' +
    '];';
  typescriptColumns = 'this.columnsSimple = [\n' +
    '  new TableColumn<ComplexTestData, \'id\'>(\'My ID\', \'id\'),\n' +
    '  new TableColumn<ComplexTestData, \'value\'>(\'My Value\', \'value\')\n' +
    '];';
  html = '<smc-simplemattable [data]="dataSimple" [columns]="columnsSimple"></smc-simplemattable>';

  constructor() {
  }

  ngOnInit() {
    /*
        Simple Table
     */
    this.dataSimple = [
      new ComplexTestData(1, 40, 'test1', null, 'test2'),
      new ComplexTestData(2, 42, 'test2', null, 'test3')
    ];
    this.columnsSimple = [
      new TableColumn<ComplexTestData, 'id'>('My ID', 'id'),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value')
    ];
  }
}
