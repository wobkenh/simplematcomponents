import { Component, OnInit } from '@angular/core';
import { TableColumn } from 'projects/simplemattable/src/public_api';
import { ComplexTestData, TestData } from '../model/test-data.model';

@Component({
  selector: 'smc-visibility',
  templateUrl: './visibility.component.html',
  styleUrls: ['./visibility.component.css']
})
export class VisibilityComponent implements OnInit {

  // Visibility Table
  dataVisibility: ComplexTestData[] = [];
  columnsVisibility: TableColumn<any, any>[] = [];

  constructor() { }

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
      Visibility Table
    */
    this.dataVisibility = [
      new ComplexTestData(1, 40, 'test1', new TestData('Key1', 'Value1', d1), 'test2'),
      new ComplexTestData(2, 42, 'test2', new TestData('Key2', 'Value2', d2), 'test3')
    ];
    this.columnsVisibility = [
      new TableColumn<ComplexTestData, 'id'>('My ID - Hidden Text on xs/sm', 'id')
        .isTextHiddenSm(true),
      new TableColumn<ComplexTestData, 'value'>('My Value - Hidden Column on xs/sm', 'value')
        .isHiddenSm(true),
      new TableColumn<ComplexTestData, 'description'>('My Description - Manual Toggle', 'description'),
    ];
  }

}
