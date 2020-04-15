import {Component, OnInit} from '@angular/core';
import {ComplexTestData} from '../model/test-data.model';
import {TableColumn} from '../../../projects/simplemattable/src/lib/model/table-column.model';
import {ExpandableRowDetailComponent} from '../expandable-row-detail/expandable-row-detail.component';

@Component({
  selector: 'smc-expandable-rows',
  templateUrl: './expandable-rows.component.html',
  styleUrls: ['./expandable-rows.component.css']
})
export class ExpandableRowsComponent implements OnInit {

  // Simple Table
  dataSimple: ComplexTestData[] = [];
  columnsSimple: TableColumn<any, any>[] = [];

  // Code
  typescriptTs = `@Component({
  selector: 'smc-expandable-rows',
  templateUrl: './expandable-rows.component.html',
  styleUrls: ['./expandable-rows.component.css']
})
export class ExpandableRowsComponent implements OnInit {

  dataSimple: ComplexTestData[] = [];
  columnsSimple: TableColumn<any, any>[] = [];

  detailRowComponent = ExpandableRowDetailComponent;

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
}`;
  html = `<smc-simplemattable [data]="dataSimple" [columns]="columnsSimple"
                    [detailRowComponent]="detailRowComponent"></smc-simplemattable>`;

  expandableRowDetailHtml = `<h2>I am a custom Detail Row Component</h2>
<p>I am displaying data for ID {{element.id}}</p>
<div style="color: blue; margin-bottom: 25px">Display whatever you want in here!</div>
`;

  expandableRowDetailTs = `@Component({
  selector: 'smc-expandable-row-detail',
  templateUrl: './expandable-row-detail.component.html',
  styleUrls: ['./expandable-row-detail.component.css']
})
export class ExpandableRowDetailComponent implements OnInit, DetailRowComponent<ComplexTestData> {

  private element: ComplexTestData;

  constructor() {
  }

  ngOnInit(): void {
  }

  onInput(element: ComplexTestData): void {
    this.element = element;
  }

}`;

  detailRowComponent = ExpandableRowDetailComponent;

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
