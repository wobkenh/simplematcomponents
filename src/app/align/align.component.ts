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
