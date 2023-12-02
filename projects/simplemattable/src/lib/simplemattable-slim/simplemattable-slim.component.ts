import {ChangeDetectorRef, Component, DoCheck, EventEmitter, Input, OnChanges, Output, SimpleChanges, Type, ViewChild} from '@angular/core';
import {SmcTableService} from '../smc-table.service';
import {TableColumn} from '../model/table-column.model';
import {MatSort, Sort} from '@angular/material/sort';
import {CdkVirtualScrollViewport, FixedSizeVirtualScrollStrategy, VIRTUAL_SCROLL_STRATEGY} from '@angular/cdk/scrolling';
import {GridTableDatasource} from '../grid-table.datasource';
import {SmcStateService} from '../smc-state.service';
import {DetailRowComponent} from '../model/detail-row-component';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {FormBuilder, FormControl} from '@angular/forms';

const ROW_HEIGHT = 30;

/**
 * Virtual Scroll Strategy
 */
export class CustomVirtualScrollStrategy extends FixedSizeVirtualScrollStrategy {
  constructor() {
    super(ROW_HEIGHT, 1000, 2000);
  }

  attach(viewport: CdkVirtualScrollViewport): void {
    this.onDataLengthChanged();
  }
}

@Component({
  selector: 'smc-simplemattable-slim',
  templateUrl: './simplemattable-slim.component.html',
  styleUrl: './simplemattable-slim.component.css',
  providers: [
    {provide: VIRTUAL_SCROLL_STRATEGY, useClass: CustomVirtualScrollStrategy}
  ], animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SimplemattableSlimComponent<T> implements DoCheck, OnChanges {
  // input
  /**
   * Input. The data for your table.
   */
  @Input() data: T[] = [];
  /**
   * Input. The columns for your table.
   */
  @Input() columns: TableColumn<T, any>[] = [];
  /**
   * Size of each row in px
   */
  @Input() itemSize: number = 30;
  /**
   * How many items to load at a time
   */
  @Input() pageSize: number = 20;
  /**
   * Additional sort to be performed if two elements equal
   */
  @Input() sortFn: (a: T, b: T) => number;
  /**
   * Component Type to be used for a detail row.
   * Will activate the detail row feature,
   * where clicking a row will expand it.
   * In the expanded area, the DetailRowComponent will be rendered.
   */
  @Input() detailRowComponent: Type<DetailRowComponent<T>>;
  /**
   * if true, will add a checkbox column and output selectionChange events
   */
  @Input() selectable: boolean = false;
  /**
   * If selectable is set to true, this will output selection changes
   */
  @Output() selectionChange: EventEmitter<T[]> = new EventEmitter<T[]>();
  /**
   * Event emitted when the user clicks a row.
   * The input parameter rowClickable must be turned to true for this to work.
   * The emitted value is the model of the row that has been clicked.
   */
  @Output() rowClick: EventEmitter<T> = new EventEmitter<T>();

  // state
  displayedColumns: TableColumn<T, any>[];
  displayedColumnKeys: string[];
  private oldColumns: TableColumn<T, any>[] = []; // For dirty-checking
  placeholderHeight = 0;
  refreshTrigger: number = 0;
  dataSource: GridTableDatasource<T>;
  stateService: SmcStateService<T> = new SmcStateService<T>();
  selectionFormControls: Map<T, FormControl<boolean>> = new Map<T, FormControl<boolean>>();

  // view childs
  @ViewChild(MatSort, {static: true})
  matSort: MatSort;
  @ViewChild(CdkVirtualScrollViewport, {static: true})
  viewport: CdkVirtualScrollViewport;

  constructor(
    private tableService: SmcTableService<T>,
    private changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder,
  ) {
  }

  // checks for column changes
  ngDoCheck(): void {
    if (this.tableService.checkForDifferences(this.oldColumns, this.columns)) {
      this.displayedColumns = this.tableService.getDisplayedCols(this.columns);
      this.displayedColumnKeys = this.displayedColumns.map(this.tableService.getColumnKey);
      if (this.selectable) {
        this.displayedColumnKeys = ['selection', ...this.displayedColumnKeys];
      }
      this.turnOffSorting(); // If columns are changed, resorting might cause bugs
      this.cleanUpAfterColChange();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      this.recreateDataSource();
      this.refreshTrigger++;
    }
  }

  private cleanUpAfterColChange() {
    this.oldColumns = this.columns.map(col => Object.assign({}, col)); // copy cols to lose references
  }

  private turnOffSorting() {
    if (this.matSort.active) {
      this.matSort.direction = '';
      this.matSort.active = '';
    }
  }

  private recreateDataSource() {
    this.dataSource = new GridTableDatasource(
      this.data,
      this.viewport,
      this.itemSize,
      this.pageSize
    );
    this.dataSource.offsetChange.subscribe(offset => {
      this.placeholderHeight = offset;
    });
    this.dataSource.data = this.data;
    // selection
    this.selectionFormControls.clear();
    if (this.selectable) {
      for (const datum of this.data) {
        this.selectionFormControls.set(datum, this.fb.control(false));
      }
    }
    for (const control of this.selectionFormControls.values()) {
      control.valueChanges.subscribe(() => {
        const selectedElements: T[] = [];
        this.selectionFormControls.forEach((c, element) => {
          if (c.value) {
            selectedElements.push(element);
          }
        });
        this.selectionChange.emit(selectedElements);
      });
    }
  }


  placeholderWhen(index: number, _: any) {
    return index === 0;
  }

  sortChanged(sort: Sort) {
    const index = sort.active.split('_')[0];
    const col = this.displayedColumns[index];
    this.data.sort((a, b) => {
      const aText: string | number = this.getSortStringRepresentation(col, a);
      const bText: string | number = this.getSortStringRepresentation(col, b);
      if (aText > bText) {
        return sort.direction === 'asc' ? 1 : -1;
      } else if (bText > aText) {
        return sort.direction === 'asc' ? -1 : 1;
      }
      if (this.sortFn) {
        return this.sortFn(a, b);
      }
      return 0;
    });
    this.recreateDataSource();
  }

  private getSortStringRepresentation(col: TableColumn<T, any>, a: T): string | number {
    /*  Sort string determination order:
        1. SortTransform
        2. Date --> ISO-String
        3. Transform (if object)
        4. Property value
     */
    if (!col) { // May happen if sorting collides with new DataSource creation
      return ''; // If that happens, multiple runs will be performed, so we will be ok with just returning empty string in this run
    }
    if (col.sortTransform) {
      return col.sortTransform(a[col.property], a, this.data);
    }
    // normally, string representation will be set via this:
    return this.stateService.getStringRepresentation(col, a, this.data);
  }

  rowClicked(row: T) {
    this.rowClick.emit(row);
    this.stateService.setExpandedElement(row);
    this.changeDetectorRef.detectChanges();
  }
}
