import { Component, OnInit } from '@angular/core';
import { TableColumn } from '../../../projects/simplemattable/src/lib/model/table-column.model';
import { Align } from '../../../projects/simplemattable/src/lib/model/align.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'smc-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  standalone: false
})
export class FooterComponent implements OnInit {

  // Align Table
  dataFooter: Product[] = [];
  columnsFooter: TableColumn<any, any>[] = [];

  // Strings
  typescriptModelType = `export interface Product {
  name: string;
  description: string;
  price: number;
}`;
  typescriptData = `this.dataFooter = [
  {
    name: 'Hitchhikers Guide',
    description: 'Life, the universe and everything',
    price: 42
  }, {
    name: 'An Apple',
    description: 'Keeps the doctor away',
    price: 2.5
  }
];`;
  typescriptColumns = `this.columnsFooter = [
  new TableColumn<Product, 'name'>('Name', 'name')
    .withFooter(() => 'Total'),
  new TableColumn<Product, 'description'>('Description', 'description'),
  new TableColumn<Product, 'price'>('Price', 'price')
    .withAlign(Align.RIGHT)
    .withTransform((value) => value + ' €')
    .withFooter((values) => values.reduce((acc, value) => acc + value, 0) + ' €')
    .withFooterNgStyle(() => ({background: 'rgba(0,0,0,.125)', borderRadius: '10px 10px 0 0'})),
];`;
  typescriptMethods = `getFooterRowClass() {
  return "my-footer";
}`;
  css = `.my-footer {
}

.my-footer div {
  font-weight: bold !important;
}`;
  html = `<smc-simplemattable [data]="dataFooter" [columns]="columnsFooter"
                    [footerRowNgStyle]="getFooterRowStyle"></smc-simplemattable>`;
  html2 = `<smc-simplemattable [data]="dataFooter" [columns]="columnsFooter" [footerRowClickable]="true"
                    [footerRowNgStyle]="getFooterRowStyle" (footerRowClick)="click($event)"></smc-simplemattable>`;

  constructor(
    private snackBar: MatSnackBar,
  ) {
  }

  ngOnInit() {
    /*
      Align Table
    */
    this.dataFooter = [
      {
        name: 'Hitchhikers Guide',
        description: 'Life, the universe and everything',
        price: 42
      }, {
        name: 'An Apple',
        description: 'Keeps the doctor away',
        price: 2.5
      }
    ];
    this.columnsFooter = [
      new TableColumn<Product, 'name'>('Name', 'name')
        .withFooter(() => 'Total'),
      new TableColumn<Product, 'description'>('Description', 'description'),
      new TableColumn<Product, 'price'>('Price', 'price')
        .withAlign(Align.RIGHT)
        .withTransform((value) => value + ' €')
        .withFooter((values) => values.reduce((acc, value) => acc + value, 0) + ' €')
        .withFooterNgStyle(() => ({ background: 'rgba(0,0,0,.125)', borderRadius: '10px 10px 0 0' })),
    ];
  }

  getFooterRowClass() {
    return 'my-footer';
  }

  click($event: any[]) {
    console.log('Data of table', $event);
    this.snackBar.open('Footer was clicked!', 'Got it!');
  }
}

export interface Product {
  name: string;
  description: string;
  price: number;
}
