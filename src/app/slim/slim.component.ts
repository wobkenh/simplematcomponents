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
  typescriptData = '  dataSimple: ComplexTestData[] = [];\n\n' +
    '  ngOnInit() {\n' +
    '    this.dataSimple = [];\n' +
    '    for (let i = 0; i < 10000; i++) {\n' +
    '      this.dataSimple.push(new ComplexTestData(1 + i, 40 + i, \'test\' + i, null, \'test2\'));\n' +
    '    }\n' +
    '  }';
  typescriptColumns = 'this.columnsSimple = [\n' +
    '  new TableColumn<ComplexTestData, \'id\'>(\'My ID\', \'id\'),\n' +
    '  new TableColumn<ComplexTestData, \'value\'>(\'My Value\', \'value\'),\n' +
    '  new TableColumn<ComplexTestData, \'description\'>(\'My Text\', \'description\')\n' +
    '];';
  html = '<smc-simplemattable-slim [data]="dataSimple" [columns]="columnsSimple" style="height: 500px"\n' +
    '                         [selectable]="true" (selectionChange)="selectionChange($event)"\n' +
    '                         [detailRowComponent]="detailRowComponent"></smc-simplemattable-slim>';

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
