import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {TableColumn} from '../model/table-column.model';
import {MatPaginator, MatTableDataSource} from '@angular/material';
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

  @ViewChild(MatPaginator) matPaginator: MatPaginator;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data) {
      this.dataSource = new MatTableDataSource(changes.data.currentValue);
      if (this.paginator) {
        this.dataSource.paginator = this.matPaginator;
      }
      this.displayedColumns = this.columns.map(col => col.property);
    }
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  getFxFlex = (tcol: TableColumn<any, any>): string => tcol.width ? '0 0 ' + tcol.width + 'px' : '1 1 0px';

  getAlign = (align: Align): string => align === Align.LEFT ? 'flex-start' : align === Align.CENTER ? 'center' : 'flex-end';
}
