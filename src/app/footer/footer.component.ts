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
  dataAlign: Product[] = [];
  columnsAlign: TableColumn<any, any>[] = [];

  // Strings
  typescriptData = 'this.dataAlign = [\n' +
    '  new ComplexTestData(1, 40, \'test1\', null, \'test2\'),\n' +
    '  new ComplexTestData(2, 42, \'test2\', null, \'test3\')\n' +
    '];';
  typescriptColumns = 'this.columnsAlign = [\n' +
    '  new TableColumn<ComplexTestData, \'id\'>(\'My ID - Left Align (Default)\', \'id\')\n' +
    '    .withWidth(Width.pct(33)),\n' +
    '  new TableColumn<ComplexTestData, \'value\'>(\'My Value - Center Align\', \'value\')\n' +
    '    .withWidth(Width.pct(33))\n' +
    '    .withAlign(Align.CENTER),\n' +
    '  new TableColumn<ComplexTestData, \'description\'>(\'My Description - Right Align\', \'description\')\n' +
    '    .withWidth(Width.pct(33))\n' +
    '    .withAlign(Align.RIGHT),\n' +
    '];';
  html = '<smc-simplemattable [data]="dataAlign" [columns]="columnsAlign"></smc-simplemattable>';

  constructor() {
  }

  ngOnInit() {
    /*
      Align Table
    */
    this.dataAlign = [
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
    this.columnsAlign = [
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
