import {Component, OnInit} from '@angular/core';
import {ComplexTestData} from '../model/test-data.model';
import {TableColumn} from '../../../projects/simplemattable/src/lib/model/table-column.model';
import {CustomTableCellComponent} from '../custom-table-cell/custom-table-cell.component';

@Component({
  selector: 'smc-component-injection',
  templateUrl: './component-injection.component.html',
  styleUrls: ['./component-injection.component.css']
})
export class ComponentInjectionComponent implements OnInit {

  dataCustomComponent: ComplexTestData[] = [];
  columnsCustomComponent: TableColumn<any, any>[] = [];

  typescriptData = 'this.dataCustomComponent = [\n' +
    '  new ComplexTestData(1, 40, \'test1\', null, \'test2\'),\n' +
    '  new ComplexTestData(2, 42, \'test2\', null, \'test3\')\n' +
    '];';
  typescriptColumns = `this.columnsCustomComponent = [
  new TableColumn<ComplexTestData, 'id'>('My ID', 'id')
    .withNgComponent(CustomTableCellComponent)
    .withNgComponentInput((component: CustomTableCellComponent, data, dataParent) => {
      // Fill the input parameters of your component - type safe if you state the class of your component above
      // data and dataParent on the other hand will be type safe automatically
      component.input = data;
    }),
  new TableColumn<ComplexTestData, 'value'>('My Value', 'value')
];`;
  typescriptFunctions = `changeData() {
  for (const datum of this.dataCustomComponent) {
    datum.id++;
  }
  this.dataCustomComponent = this.dataCustomComponent.slice(0);
}

toggleColumn() {
  this.columnsCustomComponent[0].visible = !this.columnsCustomComponent[0].visible;
}`;
  typescriptCustomComponent = `export class CustomTableCellComponent implements OnInit {

  @Input() input;

  constructor() {
  }

  ngOnInit() {
  }

}`;
  html = `<button mat-raised-button (click)="changeData()">Add to id</button>
<button mat-raised-button (click)="toggleColumn()">Toggle id visibility</button>
<smc-simplemattable [data]="dataCustomComponent" [columns]="columnsCustomComponent"></smc-simplemattable>`;
  htmlCustomComponent = `<h3>This cell would normally have ID {{input}}</h3>
<p>
  custom-table-cell-component works.
</p>`;

  constructor() {
  }

  ngOnInit() {
    /*
        Simple Table
     */
    this.dataCustomComponent = [
      new ComplexTestData(1, 40, 'test1', null, 'test2'),
      new ComplexTestData(2, 42, 'test2', null, 'test3')
    ];
    this.columnsCustomComponent = [
      new TableColumn<ComplexTestData, 'id'>('My ID', 'id')
        .withNgComponent(CustomTableCellComponent)
        .withNgComponentInput((component: CustomTableCellComponent, data, dataParent) => {
          // Fill the input parameters of your component - type safe if you state the class of your component above
          // data and dataParent on the other hand will be type safe automatically
          component.input = data;
        }),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value')
    ];
  }


  changeData() {
    for (const datum of this.dataCustomComponent) {
      datum.id++;
    }
    this.dataCustomComponent = this.dataCustomComponent.slice(0);
  }

  toggleColumn() {
    this.columnsCustomComponent[0].visible = !this.columnsCustomComponent[0].visible;
  }

}
