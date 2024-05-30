import {Component} from '@angular/core';
import {MatDivider} from '@angular/material/divider';
import {MatIcon} from '@angular/material/icon';
import {MatTab, MatTabGroup, MatTabLabel} from '@angular/material/tabs';
import {SimplemattableModule} from '../../../projects/simplemattable/src/lib/simplemattable.module';
import {ComplexTestData} from '../model/test-data.model';
import {TableColumn} from '../../../projects/simplemattable/src/lib/model/table-column.model';
import {Highlight} from 'ngx-highlightjs';

@Component({
  selector: 'smc-hover',
  standalone: true,
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
  styleUrl: './hover.component.scss'
})
export class HoverComponent {
// Simple Table
  dataHover: ComplexTestData[] = [];
  columnsHover: TableColumn<any, any>[] = [];

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
        .withOnMouseEnter((value, element, dataList, event) => {
          this.hoveredValue = value;
          this.dataHover = this.dataHover.slice(0);
        })
        .withOnMouseLeave((value, element, dataList, event) => {
          delete this.hoveredValue;
          this.dataHover = this.dataHover.slice(0);
        }),
    ];`;
  html = '<smc-simplemattable [data]="dataSimple" [columns]="columnsSimple"></smc-simplemattable>';

  hoveredValue: number;

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
        .withNgStyle((value) => this.hoveredValue === value ? ({background: 'lightblue'}) : ({}))
        .withOnMouseEnter((value, element, dataList, event) => {
          this.hoveredValue = value;
          this.dataHover = this.dataHover.slice(0);
        })
        .withOnMouseLeave((value, element, dataList, event) => {
          delete this.hoveredValue;
          this.dataHover = this.dataHover.slice(0);
        }),
    ];
  }
}
