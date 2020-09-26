import {Component, OnInit} from '@angular/core';
import {ButtonType, TableColumn} from 'projects/simplemattable/src/public_api';
import {ComplexTestData, TestData} from '../model/test-data.model';

@Component({
  selector: 'smc-icons-buttons',
  templateUrl: './icons-buttons.component.html',
  styleUrls: ['./icons-buttons.component.css']
})
export class IconsButtonsComponent implements OnInit {

  // Icons and Buttons Table
  dataIconsButtons: ComplexTestData[] = [];
  columnsIconsButtons: TableColumn<any, any>[] = [];
  columnsRowClickable: TableColumn<any, any>[] = [];
  linkClickCountIconsButtons = 0;
  linkLastClickedIconsButtons = 0;
  btnClickCountIconsButtons = 0;
  btnLastClickedIconsButtons = 0;
  rowClickCount = 0;
  rowLastClickedId = 0;
  typescriptDataIconsButtons = `this.dataVisibility = [
  new ComplexTestData(1, 40, 'test1', new TestData('Key1', 'Value1', d1), 'test2'),
  new ComplexTestData(2, 42, 'test2', new TestData('Key2', 'Value2', d2), 'test3')
];`;
  typescriptColumnsIconsButtons = `this.columnsIconsButtons = [
  new TableColumn<ComplexTestData, 'id'>('My ID - Link', 'id')
    .withOnClick(id => {
      this.linkLastClickedIconsButtons = id;
      this.linkClickCountIconsButtons++;
    }),
  new TableColumn<ComplexTestData, 'value'>('My Value - Raised Button', 'value')
    .withButton(ButtonType.RAISED)
    .withOnClick(id => {
      this.btnLastClickedIconsButtons = id;
      this.btnClickCountIconsButtons++;
    }),
  new TableColumn<ComplexTestData, 'description'>('My Description - Icon', 'description')
    .withIcon((description) => description === 'test1' ? 'delete' : 'wifi'),
];`;
  htmlIconsButton = `<div style="display: flex; flex-direction: column; padding-bottom: 25px">
  <span>Link Click count: {{linkClickCountIconsButtons}}</span>
  <span>Link Last clicked ID: {{linkLastClickedIconsButtons}}</span>
  <span>Raised Button Click count: {{btnClickCountIconsButtons}}</span>
  <span>Raised Button Last clicked Value: {{btnLastClickedIconsButtons}}</span>
</div>
<smc-simplemattable [data]="dataIconsButtons" [columns]="columnsIconsButtons"></smc-simplemattable>`;
  typescriptDataClickableRows = `this.dataIconsButtons = [
  new ComplexTestData(1, 40, 'test1', new TestData('Key1', 'Value1', d1), 'test2'),
  new ComplexTestData(2, 42, 'test2', new TestData('Key2', 'Value2', d2), 'test3')
];`;
  typescriptColumnsClickableRows = `this.columnsRowClickable = [
  new TableColumn<ComplexTestData, 'id'>('My ID', 'id'),
  new TableColumn<ComplexTestData, 'value'>('My Value', 'value')
    .withMaxLines(2),
  new TableColumn<ComplexTestData, 'description'>('My Description - Icon', 'description')
    .withIcon((description) => description === 'test1' ? 'delete' : 'wifi'),
];`;
  htmlClickableRows = `<div style="display: flex; flex-direction: column; padding-bottom: 25px">
  <span>Link Click count: {{rowClickCount}}</span>
  <span>Link Last clicked ID: {{rowLastClickedId}}</span>
</div>
<smc-simplemattable [data]="dataIconsButtons" [columns]="columnsRowClickable" [rowClickable]="true"
                    (rowClick)="rowClicked($event)"></smc-simplemattable>`;

  constructor() {
  }

  ngOnInit() {
    const d1 = new Date();
    d1.setDate(20);
    d1.setMonth(1);
    d1.setFullYear(2018);
    const d2 = new Date();
    d2.setDate(15);
    d2.setMonth(7);
    d2.setFullYear(2017);
    /*
      Icons and Buttons Table
    */
    this.dataIconsButtons = [
      new ComplexTestData(1, 40, 'test1', new TestData('Key1', 'Value1', d1), 'test2'),
      new ComplexTestData(2, 42, 'test2', new TestData('Key2', 'Value2', d2), 'test3')
    ];
    this.columnsIconsButtons = [
      new TableColumn<ComplexTestData, 'id'>('My ID - Link', 'id')
        .withOnClick(id => {
          this.linkLastClickedIconsButtons = id;
          this.linkClickCountIconsButtons++;
        }),
      new TableColumn<ComplexTestData, 'value'>('My Value - Raised Button', 'value')
        .withButton(ButtonType.RAISED)
        .withOnClick(id => {
          this.btnLastClickedIconsButtons = id;
          this.btnClickCountIconsButtons++;
        }),
      new TableColumn<ComplexTestData, 'description'>('My Description - Icon', 'description')
        .withIcon((description) => description === 'test1' ? 'delete' : 'wifi'),
    ];
    this.columnsRowClickable = [
      new TableColumn<ComplexTestData, 'id'>('My ID', 'id'),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value')
        .withMaxLines(2),
      new TableColumn<ComplexTestData, 'description'>('My Description - Icon', 'description')
        .withIcon((description) => description === 'test1' ? 'delete' : 'wifi'),
    ];
  }

  rowClicked(data: ComplexTestData) {
    this.rowClickCount++;
    this.rowLastClickedId = data.id;
  }
}
