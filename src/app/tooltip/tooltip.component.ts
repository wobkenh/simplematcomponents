import { Component, OnInit } from '@angular/core';
import { ComplexTestData } from '../model/test-data.model';
import { TableColumn } from '../../../projects/simplemattable/src/lib/model/table-column.model';

@Component({
  selector: 'smc-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.css'],
  standalone: false
})
export class TooltipComponent implements OnInit {

// Simple Table
  dataTooltip: ComplexTestData[] = [];
  columnsTooltip: TableColumn<any, any>[] = [];

  // Code
  typescriptData = 'this.dataSimple = [\n' +
    '  new ComplexTestData(1, 40, \'test1\', null, \'test2\'),\n' +
    '  new ComplexTestData(2, 42, \'test2\', null, \'test3\')\n' +
    '];';
  typescriptColumns = 'this.columnsSimple = [\n' +
    '  new TableColumn<ComplexTestData, \'id\'>(\'My ID\', \'id\')\n' +
    '    .withHeaderTooltip(\'A Tooltip on the header\'),\n' +
    '  new TableColumn<ComplexTestData, \'value\'>(\'My Value\', \'value\')\n' +
    '    .withTooltip(value => \'2x Value would be: \' + value * 2)\n' +
    '    .withTooltipPosition(\'left\'),\n' +
    '];';
  html = '<smc-simplemattable [data]="dataSimple" [columns]="columnsSimple"></smc-simplemattable>';

  constructor() {
  }

  ngOnInit() {
    /*
        Simple Table
     */
    this.dataTooltip = [
      new ComplexTestData(1, 40, 'test1', null, 'test2'),
      new ComplexTestData(2, 42, 'test2', null, 'test3')
    ];
    this.columnsTooltip = [
      new TableColumn<ComplexTestData, 'id'>('My ID', 'id')
        .withHeaderTooltip('A Tooltip on the header'),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value')
        .withTooltip(value => '2x Value would be: ' + value * 2)
        .withTooltipPosition('left')
    ];
  }

}
