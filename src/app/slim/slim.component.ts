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
      this.dataSimple.push(new ComplexTestData(
        1 + i, 40 + i,
        'test' + i + ' this text is quite long, but will not break by default (white-space: nowrap)',
        null, 'test2'
      ));
    }
    this.columnsSimple = [
      new TableColumn<ComplexTestData, 'id'>('My ID', 'id')
        .withFooter(ids => ids.reduce((acc, id) => acc + id, 0)),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value'),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value')
        .withTransform((value) => this.gen((value / 10) % 20 + 10))
        .withNgStyle(() => ({width: '200px'})),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value')
        .withTransform((value) => this.gen(20 - (value / 10) % 20 + 10))
        .withNgStyle(() => ({width: '200px'})),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value')
        .withTransform((value) => this.gen((value / 10) % 20 + 10))
        .withNgStyle(() => ({width: '200px'})),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value')
        .withTransform((value) => this.gen((value / 10) % 20 + 10))
        .withNgStyle(() => ({width: '200px'})),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value')
        .withTransform((value) => this.gen((value / 10) % 20 + 10))
        .withNgStyle(() => ({width: '200px'})),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value')
        .withTransform((value) => this.gen(20 - (value / 10) % 20 + 10)),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value')
        .withTransform((value) => this.gen((value / 10) % 20 + 10)),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value')
        .withTransform((value) => this.gen(20 - (value / 10) % 20 + 10)),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value')
        .withTransform((value) => this.gen((value / 10) % 20 + 10)),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value')
        .withTransform((value) => this.gen(20 - (value / 10) % 20 + 10)),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value')
        .withTransform((value) => this.gen((value / 10) % 20 + 10)),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value')
        .withTransform((value) => this.gen((value / 10) % 20 + 10)),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value')
        .withTransform((value) => this.gen((value / 10) % 20 + 10)),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value')
        .withTransform((value) => this.gen(20 - (value / 10) % 20 + 10)),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value'),
      new TableColumn<ComplexTestData, 'description'>('My Text', 'description')
        .withFooter(() => 'some footer text')
    ];
  }

  selectionChange($event: any[]) {
    console.log('changed', $event);
  }

  private gen(number: number) {
    let str = '';
    for (let i = 0; i < number; i++) {
      str += 'a';
    }
    return str;
  }
}
