import {Component, OnInit} from '@angular/core';
import {ComplexTestData} from '../model/test-data.model';
import {TableColumn} from '../../../projects/simplemattable/src/lib/model/table-column.model';

@Component({
  selector: 'smc-component-injection',
  templateUrl: './component-injection.component.html',
  styleUrls: ['./component-injection.component.css']
})
export class ComponentInjectionComponent implements OnInit {

  dataSimple: ComplexTestData[] = [];
  columnsSimple: TableColumn<any, any>[] = [];

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
      new TableColumn<ComplexTestData, 'id'>('My ID', 'id')
        .withNgComponent(ComponentInjectionComponent),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value')
    ];
  }

}
