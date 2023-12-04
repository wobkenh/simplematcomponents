import {ChangeDetectorRef, Component, DoCheck, EventEmitter, Input, OnChanges, Output, SimpleChanges, Type, ViewChild} from '@angular/core';
import {TableColumn} from '../model/table-column.model';
import {DetailRowComponent} from '../model/detail-row-component';
import {SmcStateService} from '../smc-state.service';
import {FormBuilder, FormControl} from '@angular/forms';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {SmcTableService} from '../smc-table.service';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'smc-simpletable',
  templateUrl: './simpletable.component.html',
  styleUrl: './simpletable.component.css',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SimpletableComponent<T> implements DoCheck, OnChanges {
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
  @Input() pageSize: number = 40;
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
  columnCount: number = 0;
  private oldColumns: TableColumn<T, any>[] = []; // For dirty-checking
  refreshTrigger: number = 0;
  stateService: SmcStateService<T> = new SmcStateService<T>();
  selectionFormControls: Map<T, FormControl<boolean>> = new Map<T, FormControl<boolean>>();
  rowClass: string = 'smt-data-row';
  hasFooter: boolean = false;
  currentSortColumn: TableColumn<T, any>;
  currentSortOrder: 'asc' | 'desc';

  // view childs
  @ViewChild(CdkVirtualScrollViewport, {static: true})
  viewport: CdkVirtualScrollViewport;

  constructor(
    private tableService: SmcTableService<T>,
    private changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder,
  ) {
  }

  public get inverseOfTranslation(): string {
    if (!this.viewport) {
      return '-0px';
    }
    const offset = this.viewport.getOffsetToRenderedContentStart();

    return `-${offset}px`;
  }

  // checks for column changes
  ngDoCheck(): void {
    if (this.tableService.checkForDifferences(this.oldColumns, this.columns)) {
      this.displayedColumns = this.tableService.getDisplayedCols(this.columns);
      this.columnCount = this.displayedColumns.length;
      if (this.selectable) {
        this.columnCount++;
      }
      this.hasFooter = this.tableService.hasFooter(this.displayedColumns);
      this.turnOffSorting(); // If columns are changed, resorting might cause bugs
      this.cleanUpAfterColChange();
      this.setRowClass();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      this.recreateFormControls();
      this.refreshTrigger++;
    }
  }

  private cleanUpAfterColChange() {
    this.oldColumns = this.columns.map(col => Object.assign({}, col)); // copy cols to lose references
  }

  private turnOffSorting() {
    delete this.currentSortOrder;
    delete this.currentSortColumn;
  }

  private recreateFormControls() {
    // selection
    if (this.selectable) {
      this.selectionFormControls.clear();
      for (const datum of this.data) {
        this.selectionFormControls.set(datum, this.fb.control(false));
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

  private setRowClass() {
    this.rowClass = 'smt-data-row';
    if (this.detailRowComponent) {
      this.rowClass = this.rowClass + ' smt-element-row';
    }
  }

  selectAll() {
    let newValue = true;
    if (this.allSelected()) {
      newValue = false;
    }
    for (const control of this.selectionFormControls.values()) {
      control.patchValue(newValue);
    }
  }

  private allSelected(): boolean {
    for (const control of this.selectionFormControls.values()) {
      if (!control.value) {
        return false;
      }
    }
    return true;
  }

  sortColumn(col: TableColumn<T, any>) {
    if (this.currentSortColumn !== col) {
      delete this.currentSortOrder;
      this.currentSortColumn = col;
    }
    let direction: 'asc' | 'desc' = 'asc';
    if (this.currentSortOrder === 'asc') {
      direction = 'desc';
    }
    this.currentSortOrder = direction;
    this.data.sort((a, b) => {
      const aText: string | number = this.getSortStringRepresentation(col, a);
      const bText: string | number = this.getSortStringRepresentation(col, b);
      if (aText > bText) {
        return direction === 'asc' ? 1 : -1;
      } else if (bText > aText) {
        return direction === 'asc' ? -1 : 1;
      }
      if (this.sortFn) {
        return this.sortFn(a, b);
      }
      return 0;
    });
    this.data = this.data.slice(0);
  }
}
