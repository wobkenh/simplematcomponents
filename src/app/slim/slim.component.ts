import { Component } from '@angular/core';
import { ComplexTestData } from '../model/test-data.model';
import { TableColumn } from '../../../projects/simplemattable/src/lib/model/table-column.model';
import { ExpandableRowDetailComponent } from '../expandable-row-detail/expandable-row-detail.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Width } from '../../../projects/simplemattable/src/lib/model/width.model';

@Component({
  selector: 'smc-slim',
  templateUrl: './slim.component.html',
  styleUrl: './slim.component.css',
  standalone: false
})
export class SlimComponent {
// Simple Table
  dataSimple: ComplexTestData[] = [];
  dataSimple3: ComplexTestData[] = [];
  columnsSimple: TableColumn<any, any>[] = [];
  columnsSimple2: TableColumn<any, any>[] = [];
  loading = true;

  // Code
  typescriptData = '  dataSimple: ComplexTestData[] = [];\n\n' +
    '  ngOnInit() {\n' +
    '    this.dataSimple = [];\n' +
    '    for (let i = 0; i < 10000; i++) {\n' +
    '      this.dataSimple.push(new ComplexTestData(1 + i, 40 + i, \'test\' + i, null, \'test2\'));\n' +
    '    }\n' +
    '  }';
  typescriptData3 = '  dataSimple3: ComplexTestData[] = [];\n\n' +
    '  ngOnInit() {\n' +
    '    this.dataSimple3 = [];\n' +
    '  }\n' +
    '  addMoreRows() {\n' +
    '    for (let i = 0; i < 5; i++) {\n' +
    '      this.dataSimple3.push(new ComplexTestData(\n' +
    '        1 + i, 40 + i,\n' +
    '        \'test\' + i + \' this text is quite long, but will not break by default (white-space: nowrap)\',\n' +
    '        null, \'test2\'\n' +
    '      ));\n' +
    '    }\n' +
    '    this.dataSimple3 = this.dataSimple3.slice(0);\n' +
    '  }';
  typescriptData4 = 'loading = true;';
  typescriptColumns = `this.columnsSimple = [
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
    ];`;
  typescriptButton = `  resetData() {
    this.dataSimple.splice(0, 1);
    this.dataSimple = this.dataSimple.slice(0);
  }`;
  html = '<smc-simplemattable-slim [data]="dataSimple" [columns]="columnsSimple" style="height: 500px"\n' +
    '                         [selectable]="true" (selectionChange)="selectionChange($event)"\n' +
    '                         [footerRowClickable]="true" (footerRowClick)="click($event)"\n' +
    '                         [detailRowComponent]="detailRowComponent"></smc-simplemattable-slim>\n' +
    '<button mat-button (click)="resetData()">REMOVE FIRST ROW</button>';
  html2 = `<smc-simpletable [data]="dataSimple" [columns]="columnsSimple2" style="height: 500px"
                           [selectable]="true" (selectionChange)="selectionChange($event)"
                           [resizableColumns]="true"
                           [footerRowClickable]="true" (footerRowClick)="click($event)"></smc-simpletable>`;
  html3 = `          <button mat-raised-button (click)="addMoreRows()" style="margin-bottom: 12px">
            <mat-icon>add</mat-icon>
            ADD MORE ROWS
          </button>
          <smc-simpletable [data]="dataSimple3" [columns]="columnsSimple"
                           [selectable]="true" (selectionChange)="selectionChange($event)"
                           [autosize]="true" [autosizeMaxHeight]="600"
                           [footerRowClickable]="true" (footerRowClick)="click($event)"></smc-simpletable>`;
  html4 = `          <button mat-raised-button (click)="loading=!loading" style="margin-bottom: 12px">
            <mat-icon>sync</mat-icon>
            TOGGLE LOADING
          </button>
          <smc-simpletable [data]="[]" [columns]="columnsSimple" [loading]="loading"
                           [selectable]="true" (selectionChange)="selectionChange($event)"
                           [autosize]="true" [autosizeMaxHeight]="600"
                           [footerRowClickable]="true" (footerRowClick)="click($event)"></smc-simpletable>`;
  typescriptColumns2 = `this.columnsSimple2 = [
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value')
        .withTransform((value) => this.gen((value / 10) % 20 + 10))
        .withWidth(Width.px(200)),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value')
        .withTransform((value) => this.gen((value / 10) % 20 + 10)),
    ];`;


  detailRowComponent = ExpandableRowDetailComponent;

  constructor(
    private snackBar: MatSnackBar,
  ) {
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
    this.dataSimple3 = [];
    this.columnsSimple2 = [
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value')
        .withTransform((value) => this.gen((value / 10) % 20 + 10))
        .withWidth(Width.px(200)),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value')
        .withTransform((value) => this.gen((value / 10) % 20 + 10)),
    ];
    this.columnsSimple = [
      new TableColumn<ComplexTestData, 'id'>('My ID', 'id')
        .withFooter(ids => ids.reduce((acc, id) => acc + id, 0)),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value'),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value')
        .withTransform((value) => this.gen((value / 10) % 20 + 10))
        .withNgStyle(() => ({ width: '200px' })),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value')
        .withTransform((value) => this.gen(20 - (value / 10) % 20 + 10))
        .withNgStyle(() => ({ width: '200px' })),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value')
        .withTransform((value) => this.gen((value / 10) % 20 + 10))
        .withNgStyle(() => ({ width: '200px' })),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value')
        .withTransform((value) => this.gen((value / 10) % 20 + 10))
        .withNgStyle(() => ({ width: '200px' })),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value')
        .withTransform((value) => this.gen((value / 10) % 20 + 10))
        .withNgStyle(() => ({ width: '200px' })),
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

  click($event: any[]) {
    this.snackBar.open('Footer was clicked!', 'Got it!');
  }

  resetData() {
    this.dataSimple.splice(0, 1);
    this.dataSimple = this.dataSimple.slice(0);
  }

  addMoreRows() {
    for (let i = 0; i < 5; i++) {
      this.dataSimple3.push(new ComplexTestData(
        1 + i, 40 + i,
        'test' + i + ' this text is quite long, but will not break by default (white-space: nowrap)',
        null, 'test2'
      ));
    }
    this.dataSimple3 = this.dataSimple3.slice(0);
  }
}
