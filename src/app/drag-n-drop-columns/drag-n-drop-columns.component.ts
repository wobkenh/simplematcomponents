import {Component, OnInit} from '@angular/core';
import {ComplexTestData} from '../model/test-data.model';
import {TableColumn} from '../../../projects/simplemattable/src/lib/model/table-column.model';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'smc-drag-n-drop-columns',
  templateUrl: './drag-n-drop-columns.component.html',
  styleUrls: ['./drag-n-drop-columns.component.css']
})
export class DragNDropColumnsComponent implements OnInit {

  // Simple Table
  dataSimple: ComplexTestData[] = [];
  columnsSimple: TableColumn<any, any>[] = [];
  dataRow: ComplexTestData[] = [];
  columnsRow: TableColumn<any, any>[] = [];
  typescriptData = `this.dataSimple = [
  new ComplexTestData(1, 40, 'test1', null, 'test2'),
  new ComplexTestData(2, 42, 'test2', null, 'test3')
];`;
  typescriptColumns = `this.columnsSimple = [
    new TableColumn<ComplexTestData, 'id'>('My ID', 'id'),
    new TableColumn<ComplexTestData, 'value'>('My Value', 'value')
];`;
  typescriptDataRow = `this.dataRow = [
  new ComplexTestData(1, 40, 'test1', null, 'test2'),
  new ComplexTestData(2, 42, 'test2', null, 'test3')
];`;
  typescriptColumsRow = `this.columnsRow = [
    new TableColumn<ComplexTestData, 'id'>('My ID', 'id'),
    new TableColumn<ComplexTestData, 'value'>('My Value', 'value')
];`;
  html = `<smc-simplemattable [data]="dataSimple" [columns]="columnsSimple"
                              [columnDragAndDrop]="true"></smc-simplemattable>`;
  htmlRow = `<smc-simplemattable [data]="dataRow" [columns]="columnsRow"
                    [rowDragAndDrop]="true" (rowDrop)="onRowDrop($event)"></smc-simplemattable>`;
  tsRow = `onRowDrop(event: CdkDragDrop<ComplexTestData>) {
  moveItemInArray(this.dataRow, event.previousIndex, event.currentIndex);
  this.dataRow = this.dataRow.slice(0);
}`;

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
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value'),
    ];
    this.dataRow = [
      new ComplexTestData(1, 40, 'test1', null, 'test2'),
      new ComplexTestData(2, 42, 'test2', null, 'test3'),
    ];
    this.columnsRow = [
      new TableColumn<ComplexTestData, 'id'>('My ID', 'id'),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value'),
    ];
  }

  onRowDrop(event: CdkDragDrop<ComplexTestData>) {
    moveItemInArray(this.dataRow, event.previousIndex, event.currentIndex);
    this.dataRow = this.dataRow.slice(0);
  }

}
