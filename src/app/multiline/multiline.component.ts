import { Component, OnInit } from '@angular/core';
import { TableColumn, Width } from 'projects/simplemattable/src/public_api';
import { ComplexTestData } from '../model/test-data.model';

@Component({
  selector: 'smc-multiline',
  templateUrl: './multiline.component.html',
  styleUrls: ['./multiline.component.css'],
  standalone: false
})
export class MultilineComponent implements OnInit {

  // Multiline
  dataMultiline: ComplexTestData[] = [];
  columnsMultiline: TableColumn<any, any>[] = [];
  typescriptData = `this.dataMultiline = [
  new ComplexTestData(1, 40, 'Lorem ipsum dolor sit amet, consetetur sadipscing ' +
    'elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam ' +
    'voluptua.', null, 'test2'),
  new ComplexTestData(2, 42, 'Text\\nWith\\nMultiline\\nJust\\nLook\\nAt\\nMe!!!', null, 'test3'),
  new ComplexTestData(3, 43, 'Regular Text!!!', null, 'test3')
];`;
  typescriptColumns = `this.columnsMultiline = [
  new TableColumn<ComplexTestData, 'id'>('My ID - Link', 'id')
    .withWidth(Width.px(100)),
  new TableColumn<ComplexTestData, 'description'>('My Description - span', 'description')
    .withWidth(Width.px(300)),
  new TableColumn<ComplexTestData, 'description'>('My Description - textarea', 'description')
    .withMaxLines(5),
];`;
  html = `<smc-simplemattable [data]="dataMultiline" [columns]="columnsMultiline"></smc-simplemattable>`;

  constructor() {
  }

  ngOnInit() {
    /*
      Multiline Table
    */
    this.dataMultiline = [
      new ComplexTestData(1, 40, 'Lorem ipsum dolor sit amet, consetetur sadipscing ' +
        'elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam ' +
        'voluptua.', null, 'test2'),
      new ComplexTestData(2, 42, 'Text\nWith\nMultiline\nJust\nLook\nAt\nMe!!!', null, 'test3'),
      new ComplexTestData(3, 43, 'Regular Text!!!', null, 'test3')
    ];
    this.columnsMultiline = [
      new TableColumn<ComplexTestData, 'id'>('My ID - Link', 'id')
        .withWidth(Width.px(100)),
      new TableColumn<ComplexTestData, 'description'>('My Description - span', 'description')
        .withWidth(Width.px(300)),
      new TableColumn<ComplexTestData, 'description'>('My Description - textarea', 'description')
        .withMaxLines(5),
    ];
  }

}
