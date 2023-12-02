import {Component} from '@angular/core';
import {ComplexTestData} from '../model/test-data.model';
import {TableColumn} from '../../../projects/simplemattable/src/lib/model/table-column.model';
import {ExpandableRowDetailComponent} from '../expandable-row-detail/expandable-row-detail.component';

@Component({
  selector: 'smc-slim',
  templateUrl: './slim.component.html',
  styleUrl: './slim.component.css'
})
export class SlimComponent {
// Simple Table
  dataSimple: ComplexTestData[] = [];
  columnsSimple: TableColumn<any, any>[] = [];

  // Code
  typescriptData = 'this.dataSimple = [\n' +
    '  new ComplexTestData(1, 40, \'test1\', null, \'test2\'),\n' +
    '  new ComplexTestData(2, 42, \'test2\', null, \'test3\')\n' +
    '];';
  typescriptColumns = 'this.columnsSimple = [\n' +
    '  new TableColumn<ComplexTestData, \'id\'>(\'My ID\', \'id\'),\n' +
    '  new TableColumn<ComplexTestData, \'value\'>(\'My Value\', \'value\')\n' +
    '];';
  html = '<smc-simplemattable [data]="dataSimple" [columns]="columnsSimple"></smc-simplemattable>';

  detailRowComponent = ExpandableRowDetailComponent;

  constructor() {
  }

  ngOnInit() {
    /*
        Simple Table
     */
    this.dataSimple = [];
    for (let i = 0; i < 10000; i++) {
      this.dataSimple.push(new ComplexTestData(1 + i, 40 + i, 'test' + i, null, 'test2'));
    }
    this.columnsSimple = [
      new TableColumn<ComplexTestData, 'id'>('My ID', 'id'),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value'),
      new TableColumn<ComplexTestData, 'description'>('My Text', 'description')
    ];
  }

  selectionChange($event: any[]) {
    console.log('changed', $event);
  }
}
