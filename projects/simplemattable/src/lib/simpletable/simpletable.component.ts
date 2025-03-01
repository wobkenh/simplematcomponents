import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  Type,
  ViewChild
} from '@angular/core';
import { TableColumn } from '../model/table-column.model';
import { DetailRowComponent } from '../model/detail-row-component';
import { SmcStateService } from '../smc-state.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { SmcTableService } from '../smc-table.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'smc-simpletable',
  templateUrl: './simpletable.component.html',
  styleUrl: './simpletable.component.css',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  standalone: false
})
export class SimpletableComponent<T> implements DoCheck, OnChanges, AfterViewInit, OnDestroy {
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
   * If set to true, simpletable will try to change its height to a value appropriate for its content
   * when data is set
   */
  @Input() autosize: boolean = false;
  /**
   * When autosize is activated, this caps the max size of the table
   */
  @Input() autosizeMaxHeight: number = 600;
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
  /**
   * Event emitted when the user clicks the footer row.
   * It is recommended to turn on the input parameter footerRowClickable for appropriate clickable styling.
   * The emitted value is the data of the table.
   */
  @Output() footerRowClick: EventEmitter<T[]> = new EventEmitter<T[]>();
  @Input() footerRowClickable: boolean = false;
  /**
   * Same as rowNgClass, but for the footer row.
   * Default undefined.
   */
  @Input() footerRowNgClass: (data: T[]) => string | string[] | Object;
  /**
   * Same as rowNgStyle, but for the footer row.
   * Default undefined.
   */
  @Input() footerRowNgStyle: (data: T[]) => Object;
  /**
   * true will turn the table into a table with fixed table layout
   * This means columns will be fully resizable,
   * but to get a decent default column width, you need to set the width on the table column
   */
  @Input() resizableColumns: boolean;
  /**
   * If true, a click on a row will select the row (= toggle the selection checkbox value)
   * If false, only a click on the checkbox will select the row
   */
  @Input() selectOnRowClick: boolean;

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
  footerRowClass: string | string[] | Object;
  footerRowStyle: Object;
  autosizeHeight: number; // the height of the table that is appropriate for its content if autosize is activated

  // view childs
  @ViewChild(CdkVirtualScrollViewport, { static: true })
  viewport: CdkVirtualScrollViewport;
  resizeObserver: ResizeObserver; // to refresh virtual scroll element

  resizing: boolean;

  constructor(
    private tableService: SmcTableService<T>,
    private changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private elementRef: ElementRef,
  ) {
  }

  ngAfterViewInit(): void {
    this.resizeObserver = new ResizeObserver(() => {
      // cdk virtual scroll does not react to resize events of the element
      // this can lead to problems, e.g. when using tabs and switching between tabs, which might change the
      // height of the hidden tabs or restore the size of the visible tab
      this.viewport.checkViewportSize();
    });
    this.resizeObserver.observe(this.elementRef.nativeElement);
  }

  addResizeMouseHandler(resizer: HTMLDivElement, th: HTMLTableCellElement, e: MouseEvent) {
    // resizing works by applying a mousemove listener to the resizer div (drag handle)
    // and then setting the width of the col on every mouse move
    // mouseup (= user letting go of the handle) removes the listener
    this.resizing = true;
    const x = e.clientX;
    const styles = window.getComputedStyle(th);
    const w = parseInt(styles.width, 10);
    const mouseMoveHandler = (eMove: MouseEvent) => {
      const dx = eMove.clientX - x;
      th.style.width = `${w + dx}px`;
    };

    const mouseUpHandler = () => {
      resizer.classList.remove('resizing');
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
      setTimeout(() => {
        // timeout because the click event from the sort header fires after
        // this mouse up event, so if we want to block the click
        // we need to keep the resize state a short while longer
        this.resizing = false;
      }, 100);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);

    resizer.classList.add('resizing');
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
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
      this.footerRowClass = this.getFooterRowClass();
      this.footerRowStyle = this.getFooterRowStyle();
      this.setAutosizeHeight(this.data?.length);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      this.recreateFormControls();
      this.footerRowClass = this.getFooterRowClass();
      this.footerRowStyle = this.getFooterRowStyle();
      this.refreshTrigger++;
      if (this.currentSortColumn) {
        // reapply sort
        this.sortData(this.currentSortColumn, this.currentSortOrder);
      }
      if (this.columnCount) {
        // ngOnChanges happens before ngDoCheck.
        // We need to react to data changes, but only after the first time the columns were initialized and the footer was checked
        this.setAutosizeHeight(changes.data.currentValue?.length || 0);
      }
    }
  }

  public get inverseOfTranslation(): string {
    if (!this.viewport) {
      return '-0px';
    }
    const offset = this.viewport.getOffsetToRenderedContentStart();

    return `-${offset}px`;
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
      // keep controls of datums that existed previously and still exist
      // create controls for new datums
      // remove (= do not carry over) controls for datums that were cleared
      const newFormControlsMap = new Map<T, FormControl<boolean>>();
      for (const datum of this.data) {
        const oldControl = this.selectionFormControls.get(datum);
        if (oldControl) {
          newFormControlsMap.set(datum, oldControl);
        } else {
          const newControl = this.fb.control(false);
          newFormControlsMap.set(datum, newControl);
          // only subscribe for new controls to avoid duplicate subscriptions
          newControl.valueChanges.subscribe(() => {
            this.emitSelected();
          });
        }
      }
      this.selectionFormControls = newFormControlsMap;
      // old selected entries might have been removed. User needs to know this, so emit selected event
      this.emitSelected();
    }
  }

  private emitSelected() {
    const selectedElements: T[] = [];
    this.selectionFormControls.forEach((c, element) => {
      if (c.value) {
        selectedElements.push(element);
      }
    });
    this.selectionChange.emit(selectedElements);
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
    if (this.selectOnRowClick) {
      this.selectionFormControls.get(row).patchValue(!this.selectionFormControls.get(row).value);
    }
    this.stateService.setExpandedElement(row);
    this.changeDetectorRef.detectChanges();
  }

  footerRowClicked() {
    this.footerRowClick.emit(this.data);
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
    if (this.resizing) {
      return;
    }
    if (this.currentSortColumn !== col) {
      delete this.currentSortOrder;
      this.currentSortColumn = col;
    }
    let direction: 'asc' | 'desc' = 'asc';
    if (this.currentSortOrder === 'asc') {
      direction = 'desc';
    }
    this.currentSortOrder = direction;
    this.sortData(col, direction);
  }

  private sortData(col: TableColumn<T, any>, direction: 'asc' | 'desc') {
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

  /**
   * Method used when a cell or a button is clicked.
   * Executes the onClick function of the TableColumn.
   *
   * @param tcol Clicked Column
   * @param element Clicked element
   * @param event mouse event
   */
  onClick(tcol: TableColumn<T, any>, element: T, event: MouseEvent) {
    // button click will be handles by table cell
    if (!tcol.button && tcol.onClick) {
      tcol.onClick(element[tcol.property], element, this.data, event);
    }
  }

  private getFooterRowClass(): string | string[] | Object {
    if (this.footerRowNgClass) {
      let classes = this.footerRowNgClass(this.data);
      if (this.footerRowClickable) {
        classes = this.tableService.addClass(classes, 'on-click');
      }
      return classes;
    } else {
      return {
        'on-click': !!this.footerRowClickable,
      };
    }
  }

  private getFooterRowStyle(): string | string[] | Object {
    if (this.footerRowNgStyle) {
      return this.footerRowNgStyle(this.data);
    } else {
      return {};
    }
  }

  private setAutosizeHeight(itemCount: number) {
    if (!this.autosize) {
      delete this.autosizeHeight;
      return;
    }
    // +1 due to divider between rows
    let height = this.itemSize + 1 + (itemCount || 0) * (this.itemSize + 1);
    if (this.hasFooter) {
      height += this.pageSize + 1;
    }
    this.autosizeHeight = Math.min(height, this.autosizeMaxHeight);
  }
}
