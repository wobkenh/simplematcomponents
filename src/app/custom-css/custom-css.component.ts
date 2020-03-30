import { Component, OnInit } from '@angular/core';
import { TableColumn } from 'projects/simplemattable/src/public_api';
import { ComplexTestData } from '../model/test-data.model';

@Component({
  selector: 'smc-custom-css',
  templateUrl: './custom-css.component.html',
  styleUrls: ['./custom-css.component.css']
})
export class CustomCssComponent implements OnInit {

  // CustomCss
  dataCustomCss: ComplexTestData[] = [];
  columnsCustomCss: TableColumn<any, any>[] = [];
  typescriptData = `this.dataCustomCss = [
  new ComplexTestData(1, 40, 'description 1', null, 'test2'),
  new ComplexTestData(2, 42, 'description 2', null, 'test3'),
  new ComplexTestData(3, 43, 'description 3', null, 'test3')
];`;
  typescriptColumns = `this.columnsCustomCss = [
  new TableColumn<ComplexTestData, 'id'>('My ID - Color depends on id', 'id')
    .withNgStyle((id) => ({'background-color': 'rgb(0, ' + id * 50 + ', 0)'})),
  new TableColumn<ComplexTestData, 'description'>('My Description with background image (ngStyle)', 'description')
    .withNgStyle(() => ({'background-image': 'url(assets/smile.png)'})),
  new TableColumn<ComplexTestData, 'description'>('My Description with background color (ngClass)', 'description')
    .withNgClass(() => 'red-bg-cell')
];`;
  css = `.red-bg-cell {
  background: #992222 !important;
  color: white;
}`;
  html = `<smc-simplemattable [data]="dataCustomCss" [columns]="columnsCustomCss"></smc-simplemattable>`;

  constructor() { }

  ngOnInit() {
    /*
      CustomCss Table
    */
    this.dataCustomCss = [
      new ComplexTestData(1, 40, 'description 1', null, 'test2'),
      new ComplexTestData(2, 42, 'description 2', null, 'test3'),
      new ComplexTestData(3, 43, 'description 3', null, 'test3')
    ];
    this.columnsCustomCss = [
      new TableColumn<ComplexTestData, 'id'>('My ID - Color depends on id', 'id')
        .withNgStyle((id) => ({'background-color': 'rgb(0, ' + id * 50 + ', 0)'})),
      new TableColumn<ComplexTestData, 'description'>('My Description with background image (ngStyle)', 'description')
        .withNgStyle(() => ({'background-image': 'url(assets/smile.png)'})),
      new TableColumn<ComplexTestData, 'description'>('My Description with background color (ngClass)', 'description')
        .withNgClass(() => 'red-bg-cell')
    ];
  }

}
