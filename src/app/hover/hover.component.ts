import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatTab, MatTabGroup, MatTabLabel } from '@angular/material/tabs';
import { SimplemattableModule } from '../../../projects/simplemattable/src/lib/simplemattable.module';
import { ComplexTestData } from '../model/test-data.model';
import { TableColumn } from '../../../projects/simplemattable/src/lib/model/table-column.model';
import { Highlight } from 'ngx-highlightjs';

@Component({
  selector: 'smc-hover',
  imports: [
    MatDivider,
    MatIcon,
    MatTab,
    MatTabGroup,
    MatTabLabel,
    SimplemattableModule,
    Highlight
  ],
  templateUrl: './hover.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './hover.component.scss'
})
export class HoverComponent {
// Simple Table
  dataHover: ComplexTestData[] = [];
  columnsHover: TableColumn<any, any>[] = [];

  // Row Highlighting Table
  dataRowHover: ComplexTestData[] = [];
  columnsRowHover: TableColumn<any, any>[] = [];

  // Code
  typescriptData = `this.dataHover = [
      new ComplexTestData(1, 40, 'test1', null, 'test2'),
      new ComplexTestData(2, 42, 'test2', null, 'test3'),
      new ComplexTestData(3, 40, 'test1', null, 'test2'),
      new ComplexTestData(4, 42, 'test2', null, 'test3'),
    ];`;
  typescriptColumns = `this.columnsHover = [
      new TableColumn<ComplexTestData, 'id'>('My ID', 'id'),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value')
        .withNgStyle((value) => this.hoveredValue === value ? ({background: 'lightblue'}) : ({}))
        .withOnMouseEnter((value) => this.hoveredValue = value)
        .withOnMouseLeave(() => delete this.hoveredValue),
    ];`;
  html = '<smc-simplemattable [data]="dataSimple" [columns]="columnsSimple"></smc-simplemattable>';
  typescriptRowColumns = `this.columnsRowHover = [
      new TableColumn<ComplexTestData, 'id'>('My ID', 'id'),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value')
        .withOnMouseEnter((value) => this.hoveredRowValue = value)
        .withOnMouseLeave(() => delete this.hoveredRowValue),
    ];
    this.rowStyleFn = (element: ComplexTestData) =>
      this.hoveredRowValue === element.value ? ({background: 'lightblue'}) : ({});`;
  htmlRow = '<smc-simplemattable [data]="dataRowHover" [columns]="columnsRowHover"\n' +
    '                    [rowNgStyle]="rowStyleFn"></smc-simplemattable>';

  hoveredValue: number;
  hoveredRowValue: number;

  rowStyleFn = (element: ComplexTestData) =>
    this.hoveredRowValue === element.value ? ({ background: 'lightblue' }) : ({});

  constructor() {
  }

  ngOnInit() {
    /*
        Simple Table
     */
    this.dataHover = [
      new ComplexTestData(1, 40, 'test1', null, 'test2'),
      new ComplexTestData(2, 42, 'test2', null, 'test3'),
      new ComplexTestData(3, 40, 'test1', null, 'test2'),
      new ComplexTestData(4, 42, 'test2', null, 'test3'),
    ];
    this.columnsHover = [
      new TableColumn<ComplexTestData, 'id'>('My ID', 'id'),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value')
        .withNgStyle((value) => this.hoveredValue === value ? ({ background: 'lightblue' }) : ({}))
        .withOnMouseEnter((value) => this.hoveredValue = value)
        .withOnMouseLeave(() => delete this.hoveredValue),
    ];

    /*
        Row Highlighting Table
     */
    this.dataRowHover = [
      new ComplexTestData(1, 40, 'test1', null, 'test2'),
      new ComplexTestData(2, 42, 'test2', null, 'test3'),
      new ComplexTestData(3, 40, 'test1', null, 'test2'),
      new ComplexTestData(4, 42, 'test2', null, 'test3'),
    ];
    this.columnsRowHover = [
      new TableColumn<ComplexTestData, 'id'>('My ID', 'id'),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value')
        .withOnMouseEnter((value) => this.hoveredRowValue = value)
        .withOnMouseLeave(() => delete this.hoveredRowValue),
    ];
  }
}
