import { Component, OnInit } from '@angular/core';
import { ComplexTestData } from '../model/test-data.model';
import { Align, ButtonType, TableColumn, Width } from 'projects/simplemattable/src/public_api';

@Component({
  selector: 'smc-direct-edit',
  templateUrl: './direct-edit.component.html',
  styleUrls: ['./direct-edit.component.css'],
  standalone: false
})
export class DirectEditComponent implements OnInit {

  // Direct Edit
  dataDirectEdit: ComplexTestData[] = [];
  columnsDirectEdit: TableColumn<any, any>[] = [];
  dataDirectEdit2: ComplexTestData[] = [];
  columnsDirectEdit2: TableColumn<any, any>[] = [];
  filteredData: ComplexTestData[] = [];

  typescriptData = `this.dataDirectEdit = [
  new ComplexTestData(1, 40, 'test1', null, 'test2'),
  new ComplexTestData(2, 42, 'test2', null, 'test3')
];`;
  typescriptColumn = `const idCol = new TableColumn<ComplexTestData, 'id'>('My ID', 'id');
const valueCol = new TableColumn<ComplexTestData, 'value'>('My Value', 'value')
  .isDirectEdit(true);
valueCol.withFormField(valueCol.getNumberFormField().withOnDirectEditModelChange((newValue, property, element) => {
  console.log(\`New value of field "value" of element with id \${element.id} is: \${newValue} and old value was: \${property}\`);
  // Note that we have to set the new value ourselves when using this callback!
  element.value = newValue;
}));
const notesCol = new TableColumn<ComplexTestData, 'notes'>('My Notes', 'notes')
  .isDirectEdit(true);
notesCol.withFormField(notesCol.getTextFormField());
this.columnsDirectEdit = [
  idCol, valueCol, notesCol
];`;
  html = `<smc-simplemattable [data]="dataDirectEdit" [columns]="columnsDirectEdit"></smc-simplemattable>`;

  typescriptData2 = `filteredData: ComplexTestData[] = [];

this.dataDirectEdit2 = [
new ComplexTestData(1, 40, 'test1', null, 'test2'),
new ComplexTestData(2, 42, 'test2', null, 'test3')
];`;
  typescriptColumns2 = `const boolCol = new TableColumn<ComplexTestData, any>('Select to delete', '_deleteFlag')
  .withAlign(Align.CENTER).withWidth(Width.px(100))
  .isDirectEdit(true)
  .withHeaderTooltip('Select all items')
  .withHeaderButton(ButtonType.ICON).withHeaderIcon('select_all')
  .withOnHeaderClick((dataList) => {
    dataList.forEach(datum => datum['_deleteFlag'] = true);
  });
boolCol.withFormField(boolCol.getCheckboxFormField());
this.columnsDirectEdit2 = [
  boolCol,
  new TableColumn<ComplexTestData, 'id'>('My ID', 'id'),
  new TableColumn<ComplexTestData, 'value'>('My Value', 'value'),
];`;
  typescriptMethods2 = `deleteSelected() {
  this.dataDirectEdit2 = this.dataDirectEdit2.filter(datum => !datum['_deleteFlag']);
}

deleteAllFiltered() {
  const idsToDelete = this.filteredData.map(datum => datum.id);
  this.dataDirectEdit2 = this.dataDirectEdit2.filter(datum => !idsToDelete.includes(datum.id));
}

selectAllFiltered() {
  const idsToSelect = this.filteredData.map(datum => datum.id);
  this.dataDirectEdit2
    .filter(datum => idsToSelect.includes(datum.id))
    .forEach(datum => datum['_deleteFlag'] = true);
}`;
  html2 = `<button mat-raised-button (click)="deleteSelected()" style="margin-right: 15px">Delete Selected</button>
<button mat-raised-button (click)="selectAllFiltered()" style="margin-right: 15px">Select all filtered
  elements
</button>
<button mat-raised-button (click)="deleteAllFiltered()">Delete all filtered elements</button>
<smc-simplemattable [data]="dataDirectEdit2" [columns]="columnsDirectEdit2" [filter]="true"
                    style="background: white"
                    (filteredData)="filteredData=$event" [paginator]="true"></smc-simplemattable>`;

  constructor() {
  }

  ngOnInit() {
    /*
        Direct Edit Table
     */
    this.dataDirectEdit = [
      new ComplexTestData(1, 40, 'test1', null, 'test2'),
      new ComplexTestData(2, 42, 'test2', null, 'test3'),
      new ComplexTestData(3, 42, 'test3', null, 'test4'),
      new ComplexTestData(4, 42, 'test4', null, 'test5'),
      new ComplexTestData(5, 42, 'test5', null, 'test6')
    ];

    const idCol = new TableColumn<ComplexTestData, 'id'>('My ID', 'id');
    const valueCol = new TableColumn<ComplexTestData, 'value'>('My Value', 'value')
      .isDirectEdit(true);
    valueCol.withFormField(valueCol.getNumberFormField().withOnDirectEditModelChange((newValue, property, element) => {
      console.log(`New value of field "value" of element with id ${element.id} is: ${newValue} and old value was: ${property}`);
      // Note that we have to set the new value ourselves when using this callback!
      element.value = newValue;
    }));
    const notesCol = new TableColumn<ComplexTestData, 'notes'>('My Notes', 'notes')
      .isDirectEdit(true);
    notesCol.withFormField(notesCol.getTextFormField());
    this.columnsDirectEdit = [
      idCol, valueCol, notesCol
    ];

    this.dataDirectEdit2 = [
      new ComplexTestData(1, 40, 'test1', null, 'test2'),
      new ComplexTestData(2, 42, 'test2', null, 'test3'),
      new ComplexTestData(3, 42, 'test2', null, 'test3'),
      new ComplexTestData(4, 42, 'test2', null, 'test3'),
      new ComplexTestData(5, 42, 'test2', null, 'test3'),
      new ComplexTestData(6, 42, 'test2', null, 'test3'),
      new ComplexTestData(7, 42, 'test2', null, 'test3'),
      new ComplexTestData(8, 42, 'test2', null, 'test3'),
      new ComplexTestData(9, 42, 'test2', null, 'test3'),
      new ComplexTestData(10, 42, 'test2', null, 'test3'),
      new ComplexTestData(11, 42, 'test2', null, 'test3'),
      new ComplexTestData(12, 42, 'test2', null, 'test3')
    ];
    const boolCol = new TableColumn<ComplexTestData, any>('Select to delete', '_deleteFlag')
      .withAlign(Align.CENTER).withWidth(Width.px(100))
      .isDirectEdit(true)
      .withHeaderButton(ButtonType.ICON).withHeaderIcon('select_all')
      .withHeaderTooltip('Select all items')
      .withOnHeaderClick((dataList) => {
        dataList.forEach(datum => datum['_deleteFlag'] = true);
      });
    boolCol.withFormField(boolCol.getCheckboxFormField());
    this.columnsDirectEdit2 = [
      boolCol,
      new TableColumn<ComplexTestData, 'id'>('My ID', 'id'),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value'),
    ];
  }

  deleteSelected() {
    this.dataDirectEdit2 = this.dataDirectEdit2.filter(datum => !datum['_deleteFlag']);
  }

  logDataDirectEdit() {
    console.log(this.dataDirectEdit);
  }


  deleteAllFiltered() {
    const idsToDelete = this.filteredData.map(datum => datum.id);
    this.dataDirectEdit2 = this.dataDirectEdit2.filter(datum => !idsToDelete.includes(datum.id));
  }

  selectAllFiltered() {
    const idsToSelect = this.filteredData.map(datum => datum.id);
    this.dataDirectEdit2
      .filter(datum => idsToSelect.includes(datum.id))
      .forEach(datum => datum['_deleteFlag'] = true);
  }

}
