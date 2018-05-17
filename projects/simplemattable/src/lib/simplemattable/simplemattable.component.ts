import {ChangeDetectorRef, Component, DoCheck, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {TableColumn} from '../model/table-column.model';
import {MatPaginator, MatSort, MatTable, MatTableDataSource, SortDirection} from '@angular/material';
import {Align} from '../model/align.model';
import {ButtonType} from '../model/button-type.model';

@Component({
  selector: 'smc-simplemattable',
  templateUrl: './simplemattable.component.html',
  styleUrls: ['./simplemattable.component.css']
})
export class SimplemattableComponent implements DoCheck, OnChanges {

  displayedColumns = [];
  dataSource: MatTableDataSource<any>;
  @Input() data: any[] = [];
  @Input() columns: TableColumn<any, any>[] = [];
  private oldColumns: TableColumn<any, any>[] = [];
  @Input() filter: boolean = false;
  @Input() paginator: boolean = false;
  @Input() sorting: boolean = false;
  @Input() paginatorPageSize: number = 10;
  @Input() paginatorPageSizeOptions: number[] = [5, 10, 20];
  @Input() editable: boolean = false;
  @Input() addable: boolean = false;
  @Input() deletable: boolean = false;

  @ViewChild(MatPaginator) matPaginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;
  @ViewChild(MatTable) matTable: MatTable<any>;
  buttonType = ButtonType;

  constructor() {
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  onClick(tcol: TableColumn<any, any>, element: any, fromButton: boolean) {
    if (fromButton ? this.isButtonClickable(tcol) : this.isCellClickable(tcol)) {
      tcol.onClick(element[tcol.property], element);
    }
  }

  private isButtonClickable = (tcol: TableColumn<any, any>) => tcol.onClick && tcol.button;
  private isCellClickable = (tcol: TableColumn<any, any>) => tcol.onClick && !tcol.button;

  getCellCssClass(tcol: TableColumn<any, any>, element: any): Object {
    const defaultClass = {'on-click': (tcol.onClick && !tcol.button)};
    if (!tcol.ngClass) {
      return defaultClass;
    }
    const ngClass = tcol.ngClass(element[tcol.property], element);
    if (!ngClass) {
      return defaultClass;
    }
    if (typeof ngClass === 'string') {
      return Object.assign(defaultClass, this.arrayToObject(ngClass.split(' ')));
    } else if (Array.isArray(ngClass)) {
      return Object.assign(defaultClass, this.arrayToObject(ngClass));
    } else {
      return Object.assign(defaultClass, ngClass);
    }
  }

  getCellCssStyle(tcol: TableColumn<any, any>, element: any): Object {
    const defaultStyle = {'justify-content': this.getAlign(tcol.align), 'display': 'flex'};
    return tcol.ngStyle ? Object.assign(defaultStyle, tcol.ngStyle(element[tcol.property], element)) : defaultStyle;
  }

  getStringRepresentation(tcol: TableColumn<any, any>, element: any): string {
    return tcol.transform ? tcol.transform(element[tcol.property], element) : element[tcol.property].toString();
  }

  getIconName = (tcol: TableColumn<any, any>, element: any) => tcol.icon(element[tcol.property], element);
  getDisplayedCols = (cols: TableColumn<any, any>[]): TableColumn<any, any>[] => cols.filter(col => col.visible);
  getFxFlex = (tcol: TableColumn<any, any>): string => tcol.width ? tcol.width : '1 1 0px';
  getAlign = (align: Align): string => align === Align.LEFT ? 'flex-start' : align === Align.CENTER ? 'center' : 'flex-end';
  getTextAlign = (align: Align): string => align === Align.LEFT ? 'start' : align === Align.CENTER ? 'center' : 'end';
  isCenterAlign = (tcol: TableColumn<any, any>): boolean => tcol.align === Align.CENTER;

  arrayToObject(arr: string[]): Object {
    return arr.reduce((acc, entry) => {
      acc[entry] = true;
      return acc;
    }, {});
  }

  /* -----------------------
      DIRTY CHECKING AND DATASOURCE REBUILDING
     ----------------------- */

  // checks for data changes
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data) {
      this.recreateDataSource();
      if (this.matSort.active) {
        if (changes.columns) { // If columns are changed, resorting might cause bugs
          this.turnOffSorting();
        } else {
          this.dataSource.data = this.dataSource.sortData(this.dataSource.data, this.matSort);
        }
      }
    }
  }

  // checks for column changes
  ngDoCheck(): void {
    if (this.checkForDifferences()) {
      this.turnOffSorting();
      this.recreateDataSource();
      this.oldColumns = this.columns.map(col => Object.assign({}, col)); // copy cols to lose references
    }
  }

  private turnOffSorting() {
    if (this.matSort.active) {
      this.matSort.direction = '';
      this.matSort.active = '';
    }
  }

  // only checks for column differences
  private checkForDifferences(): boolean {
    if (this.oldColumns.length !== this.columns.length) {
      return true;
    }
    return this.oldColumns.some((col, i) => {
      for (const key in col) {
        if (col[key] !== this.columns[i][key]) {
          return true;
        }
      }
    });
  }

  private recreateDataSource() {
    if (this.columns && this.data) {
      this.dataSource = new MatTableDataSource(this.data);
      this.dataSource.filterPredicate = (data: any, filter: string) =>
        this.columns.reduce((str, col) => str + this.getStringRepresentation(col, data).toLowerCase().trim(), '')
          .indexOf(filter.toLowerCase().trim()) >= 0;

      if (this.paginator) {
        this.dataSource.paginator = this.matPaginator;
      }
      if (this.sorting) {
        // Closure for visible cols possible since column change will always also provoke a dataSource rebuild
        const visibleCols = this.columns.filter(col => col.visible);
        this.dataSource.sort = this.matSort;
        this.dataSource.sortingDataAccessor = (data, sortHeaderId) => {
          /*  Sort string determination order:
              1. SortTransform
              2. Date --> ISO-String
              3. Transform (if object)
              4. Property value
           */
          const tcol = visibleCols[sortHeaderId.split('_')[0]];
          if (!tcol) { // May happen if sorting collides with new DataSource creation
            return ''; // If that happens, multiple runs will be performed, so we will be ok with just returning empty string in this run
          }
          if (tcol.sortTransform) {
            return tcol.sortTransform(data[tcol.property], data);
          }
          if (data[tcol.property] instanceof Date) {
            return data[tcol.property].toISOString();
          }
          // Cant sort if data is object of a format i do not know since toString will be [object Object].
          // Therefore, try to use transform if possible
          if (tcol.transform && typeof data[tcol.property] === 'object') {
            return tcol.transform(data[tcol.property]);
          }
          return data[tcol.property];
        };
      }
      this.displayedColumns = this.getDisplayedCols(this.columns).map((col, i) => i.toString() + '_' + col.property);
    }
  }
}
