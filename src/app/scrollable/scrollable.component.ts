import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TableColumn } from 'projects/simplemattable/src/public_api';
import { ComplexTestData } from '../model/test-data.model';
import PerfectScrollbar from 'perfect-scrollbar';

@Component({
  selector: 'smc-scrollable',
  templateUrl: './scrollable.component.html',
  styleUrls: ['./scrollable.component.css']
})
export class ScrollableComponent implements OnInit, AfterViewInit {

  // Scrollable
  dataScrollable: ComplexTestData[] = [];
  columnsScrollable: TableColumn<any, any>[] = [];

  constructor() { }

  ngOnInit() {
    /*
      Scrollable Table
    */
    this.dataScrollable = [
      new ComplexTestData(1, 40, 'description 1', null, 'test2'),
      new ComplexTestData(2, 42, 'description 2', null, 'test3'),
      new ComplexTestData(3, 43, 'description 3', null, 'test3'),
      new ComplexTestData(4, 44, 'description 4', null, 'test4'),
      new ComplexTestData(5, 45, 'description 5', null, 'test5'),
      new ComplexTestData(6, 46, 'description 6', null, 'test6'),
      new ComplexTestData(7, 47, 'description 7', null, 'test7'),
      new ComplexTestData(8, 48, 'description 8', null, 'test8'),
      new ComplexTestData(9, 49, 'description 9', null, 'test9'),
      new ComplexTestData(10, 50, 'description 10', null, 'test10'),
      new ComplexTestData(11, 51, 'description 11', null, 'test11'),
      new ComplexTestData(12, 52, 'description 12', null, 'test12'),
      new ComplexTestData(13, 53, 'description 13', null, 'test13'),
      new ComplexTestData(14, 54, 'description 14', null, 'test14')
    ];

    this.columnsScrollable = [
      new TableColumn<ComplexTestData, 'id'>('My ID', 'id'),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value'),
      new TableColumn<ComplexTestData, 'description'>('My Description', 'description')
    ];
  }

  ngAfterViewInit() {
    const container: any = document.querySelector('#smtScrollContainer');
    const ps = new PerfectScrollbar(container);
  }

}
