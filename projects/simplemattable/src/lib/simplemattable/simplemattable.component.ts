import {Component, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {TableColumn} from '../model/table-column.model';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Align} from '../model/align.model';

@Component({
  selector: 'smc-simplemattable',
  templateUrl: './simplemattable.component.html',
  styleUrls: ['./simplemattable.component.css']
})
export class SimplemattableComponent implements OnChanges {

  displayedColumns = [];
  dataSource: MatTableDataSource<any>;
  @Input() data: any[] = [];
  @Input() columns: TableColumn<any, any>[] = [];
  @Input() filter: boolean = false;
  @Input() paginator: boolean = false;
  @Input() sorting: boolean = false;

  @ViewChild(MatPaginator) matPaginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data) {
      this.dataSource = new MatTableDataSource(changes.data.currentValue);
      this.dataSource.filterPredicate = (data: any, filter: string) =>
        this.columns.reduce((str, col) => str + this.getStringRepresentation(col, data).toLowerCase().trim(), '')
          .indexOf(filter.toLowerCase().trim()) >= 0;
      if (this.paginator) {
        this.dataSource.paginator = this.matPaginator;
        this.dataSource.sort = this.matSort;
      }
      this.displayedColumns = this.columns.map((col, i) => i.toString() + col.property);
    }
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  getFxFlex = (tcol: TableColumn<any, any>): string => tcol.width ? '0 0 ' + tcol.width + 'px' : '1 1 0px';

  getStringRepresentation = (tcol: TableColumn<any, any>, element: any) =>
    tcol.transform ? tcol.transform(element[tcol.property]) : element[tcol.property].toString();

  getAlign = (align: Align): string => align === Align.LEFT ? 'flex-start' : align === Align.CENTER ? 'center' : 'flex-end';

}
