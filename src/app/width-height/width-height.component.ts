import { Component, OnInit } from '@angular/core';
import { Height, TableColumn, Width } from 'projects/simplemattable/src/public_api';
import { ComplexTestData } from '../model/test-data.model';

@Component({
  selector: 'smc-width-height',
  templateUrl: './width-height.component.html',
  styleUrls: ['./width-height.component.css'],
  standalone: false
})
export class WidthHeightComponent implements OnInit {

  // Width Table
  dataWidth: ComplexTestData[] = [];
  columnsWidth: TableColumn<any, any>[] = [];
  typescriptData = `this.dataWidth = [
  new ComplexTestData(1, 40, 'test1', null, 'test2'),
  new ComplexTestData(2, 42, 'test2', null, 'test3')
];`;
  typescriptColumns = `this.columnsWidth = [
  new TableColumn<ComplexTestData, 'id'>('My ID', 'id')
    .withWidth(Width.px(100))
    .withHeightFn((id) => id === 1 ? Height.px(100) : null),
  new TableColumn<ComplexTestData, 'value'>('My Value', 'value')
    .withWidth(Width.pct(50)),
  new TableColumn<ComplexTestData, 'description'>('My Description', 'description')
];`;
  html = `<smc-simplemattable [data]="dataWidth" [columns]="columnsWidth"></smc-simplemattable>`;

  constructor() {
  }

  ngOnInit() {
    /*
      Width/Height Table
    */
    this.dataWidth = [
      new ComplexTestData(1, 40, 'test1', null, 'test2'),
      new ComplexTestData(2, 42, 'test2', null, 'test3')
    ];
    this.columnsWidth = [
      new TableColumn<ComplexTestData, 'id'>('My ID', 'id')
        .withWidth(Width.px(100))
        .withHeightFn((id) => id === 1 ? Height.px(100) : null),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value')
        .withWidth(Width.pct(50)),
      new TableColumn<ComplexTestData, 'description'>('My Description', 'description')
    ];
  }

}
