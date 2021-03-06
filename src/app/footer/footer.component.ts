import {Component, OnInit} from '@angular/core';
import {TableColumn} from '../../../projects/simplemattable/src/lib/model/table-column.model';
import {Align} from '../../../projects/simplemattable/src/lib/model/align.model';

@Component({
  selector: 'smc-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
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
  typescriptMethods = `getFooterRowStyle() {
  return {
    fontWeight: 'bold'
  };
}`;
  html = `<smc-simplemattable [data]="dataFooter" [columns]="columnsFooter"
                    [footerRowNgStyle]="getFooterRowStyle"></smc-simplemattable>`;

  constructor() {
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
        .withFooterNgStyle(() => ({background: 'rgba(0,0,0,.125)', borderRadius: '10px 10px 0 0'})),
    ];
  }

  getFooterRowStyle() {
    return {
      fontWeight: 'bold'
    };
  }

}

export interface Product {
  name: string;
  description: string;
  price: number;
}
