import { Component, OnInit } from '@angular/core';
import { TableColumn, Width, Align } from 'projects/simplemattable/src/public_api';
import { ComplexTestData } from '../model/test-data.model';

@Component({
  selector: 'smc-align',
  templateUrl: './align.component.html',
  styleUrls: ['./align.component.css']
})
export class AlignComponent implements OnInit {

  // Align Table
  dataAlign: ComplexTestData[] = [];
  columnsAlign: TableColumn<any, any>[] = [];

  // Strings
  typescriptData = 'this.dataAlign = [\n' +
    '  new ComplexTestData(1, 40, \'test1\', null, \'test2\'),\n' +
    '  new ComplexTestData(2, 42, \'test2\', null, \'test3\')\n' +
    '];';
  typescriptColumns = 'this.columnsAlign = [\n' +
    '  new TableColumn<ComplexTestData, \'id\'>(\'My ID - Left Align (Default)\', \'id\')\n' +
    '    .withWidth(Width.pct(33)),\n' +
    '  new TableColumn<ComplexTestData, \'value\'>(\'My Value - Center Align\', \'value\')\n' +
    '    .withWidth(Width.pct(33))\n' +
    '    .withAlign(Align.CENTER),\n' +
    '  new TableColumn<ComplexTestData, \'description\'>(\'My Description - Right Align\', \'description\')\n' +
    '    .withWidth(Width.pct(33))\n' +
    '    .withAlign(Align.RIGHT),\n' +
    '];';
  html = '<smc-simplemattable [data]="dataAlign" [columns]="columnsAlign"></smc-simplemattable>';

  constructor() { }

  ngOnInit() {
    /*
      Align Table
    */
    this.dataAlign = [
      new ComplexTestData(1, 40, 'test1', null, 'test2'),
      new ComplexTestData(2, 42, 'test2', null, 'test3')
    ];
    this.columnsAlign = [
      new TableColumn<ComplexTestData, 'id'>('My ID - Left Align (Default)', 'id')
        .withWidth(Width.pct(33)),
      new TableColumn<ComplexTestData, 'value'>('My Value - Center Align', 'value')
        .withWidth(Width.pct(33))
        .withAlign(Align.CENTER),
      new TableColumn<ComplexTestData, 'description'>('My Description - Right Align', 'description')
        .withWidth(Width.pct(33))
        .withAlign(Align.RIGHT),
    ];
  }

}
