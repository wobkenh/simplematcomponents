import {
  AfterViewInit,
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  Type,
  ViewChild
} from '@angular/core';
import { TableColumn } from '../model/table-column.model';
import { Align } from '../model/align.model';
import { AbstractControl, FormBuilder, FormControl } from '@angular/forms';
import { DataStatus } from '../model/data-status.model';
import { Observable, Subscription } from 'rxjs';
import { PageSettings } from '../model/page-settings.model';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { Height } from '../model/height.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DetailRowComponent } from '../model/detail-row-component';
import { ButtonType } from '../model/button-type.model';

@Component({
  selector: 'smc-simplemattable',
  templateUrl: './simplemattable.component.html',
  styleUrls: ['./simplemattable.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SimplemattableComponent<T> implements OnInit, DoCheck, OnChanges, AfterViewInit {

  /**
   * Input. The data for your table.
   */
  @Input() data: T[] = [];
  /**
   * Input. The columns for your table.
   */
  @Input() columns: TableColumn<T, any>[] = [];
  /**
   * Input. True activates a single filter input to filter the whole table. Default false.
   */
  @Input() filter: boolean = false;
  /**
   * Input. Text to be displayed in the filter input. Default 'Filter'.
   */
  @Input() filterLabel: string = 'Filter';
  /**
   * Input. True disables the simplemattable filter algorithm and forwards searches to
   * the search output parameter so you can do filtering yourself. Default false.
   */
  @Input() noOpFilter: boolean = false;
  /**
   * Input. True activates a paginator. Default false.
   */
  @Input() paginator: boolean = false;
  /**
   * Input. True activates sorting of table columns. Default false.
   */
  @Input() sorting: boolean = false;
  /**
   * Input. Requires paginator to be true.
   * Lets you fetch new pages from a server when the user navigates the pages.
   * See getPage input and page output parameter.
   * Default false.
   */
  @Input() backendPagination: boolean = false;
  /**
   * When activated, shows a loading circle on top of the table. Default false.
   */
  @Input() loading: boolean = false;
  /**
   * Function to be used by simplemattable to fetch data from a server.
   * Use with backend pagination.
   * Default undefined.
   */
  @Input() getPage: (offset: number, limit: number) => Observable<T[]>;
  /**
   * Length of paginator. Use with backendPagination to set the count fetched from the server. Default 0.
   */
  @Input() paginatorLength: number = 0;
  /**
   * Default Page Size of the paginator. Default 10.
   */
  @Input() paginatorPageSize: number = 10;
  /**
   * Page Size options available for the user. Default [5, 10, 20].
   */
  @Input() paginatorPageSizeOptions: number[] = [5, 10, 20];
  /**
   * True allows editing existing elements of the table. Default false.
   */
  @Input() editable: boolean = false;
  /**
   * True allows the addition of new elements to the table. Default false.
   */
  @Input() addable: boolean = false;
  /**
   * True allows deleting elements of the table. Default false.
   */
  @Input() deletable: boolean = false;
  /**
   * True allows deleting all elements of the table at once using a button in the top right corner. Default false.
   * `deletable` needs to be set to true for this to work.
   */
  @Input() deleteAllButton: boolean = false;
  /**
   * Material Icon used for the edit button. Default 'edit'.
   */
  @Input() editIcon: string;
  /**
   * Material Icon used for the add button. Default 'add_box'.
   */
  @Input() addIcon: string;
  /**
   * Material Icon used for the delete button. Default 'delete'.
   */
  @Input() deleteIcon: string;
  /**
   * Material Icon used for the save button. Default save.
   */
  @Input() saveIcon: string;
  /**
   * Material Icon used for the cancel button. Default cancel.
   */
  @Input() cancelIcon: string;
  /**
   * Function to create a new model instance when user adds an element to the table.
   * Must be specified if adding is enabled. Default undefined.
   */
  @Input() create: () => T;
  /**
   * True to make the table header sticky. Default false.
   */
  @Input() sticky: boolean = false;
  /**
   * True to make the button column sticky (only visible when form functions are enabled).
   * Default false.
   */
  @Input() stickyButtons: boolean = false;
  /**
   * True to make the table show a scrollbar when the content is larger than the provided space.
   */
  @Input() overflowAuto: boolean = false;
  /**
   * Page Settings for the paginator. Can be used to programmatically change the page.
   */
  @Input() pageSettings: PageSettings;
  /**
   * True to display only a page of the elements and fetch new elements when the user scrolls to the bottom.
   * Default false.
   */
  @Input() infiniteScrolling: boolean = false;
  /**
   * Number of elements to be fetched at a time when using infinite scrolling.
   * Default 10.
   */
  @Input() infiniteScrollingPageSize: number = 10;
  /**
   * How many pixels the user needs to be away from the bottom of the page for the infinite scrolling feature to load the next page.
   * Default 200px.
   */
  @Input() infiniteScrollingHeight: Height = Height.px(200);
  /**
   * True to make the row clickable. Events will be emitted via rowClick output parameter.
   * Default false.
   */
  @Input() rowClickable: boolean = false;
  /**
   * Function to provide a style object for customization of row styling.
   * Default undefined.
   */
  @Input() rowNgStyle: (data: T, dataList: T[]) => Object;
  /**
   * Function to provide a class string/object  for customization of row styling.
   * Default undefined.
   */
  @Input() rowNgClass: (data: T, dataList: T[]) => string | string[] | Object;
  /**
   * Same as rowNgStyle, but for the footer row.
   * Default undefined.
   */
  @Input() footerRowNgStyle: (data: T[]) => Object;
  /**
   * Same as rowNgClass, but for the footer row.
   * Default undefined.
   */
  @Input() footerRowNgClass: (data: T[]) => string | string[] | Object;
  /**
   * True to allow the user to drag and drop the table columns.
   * Default false;
   */
  @Input() columnDragAndDrop: boolean = false;
  /**
   * Component Type to be used for a detail row.
   * Will activate the detail row feature,
   * where clicking a row will expand it.
   * In the expanded area, the DetailRowComponent will be rendered.
   */
  @Input() detailRowComponent: Type<DetailRowComponent<T>>;


  private infiniteScrollingPage: number = 0;
  private infiniteScrollingHasMore: boolean = true;
  private infiniteScrollingHasScrolled: boolean = false;

  /**
   * Event emitted when a user has deleted an element.
   * Emitted value is the deleted element.
   */
  @Output() delete: EventEmitter<T> = new EventEmitter<T>();
  /**
   * Event emitted when a user wants to delete all elements.
   * Emitted value is the all current data elements.
   */
  @Output() deleteAll: EventEmitter<T[]> = new EventEmitter<T[]>();
  /**
   * Event emitted when a user has edited an element.
   * Emitted value is the edited element.
   */
  @Output() edit: EventEmitter<T> = new EventEmitter<T>();
  /**
   * Event emitted when a user starts editing an element.
   * Emitted value is the current value of the element being edited.
   */
  @Output() startEdit: EventEmitter<T> = new EventEmitter<T>();
  /**
   * Event emitted when a user has canceled editing an element.
   * Emitted value is the unedited value of the element.
   */
  @Output() cancelEdit: EventEmitter<T> = new EventEmitter<T>();
  /**
   * Event emitted when a user has added an element.
   * Emitted value is the added element.
   */
  @Output() add: EventEmitter<T> = new EventEmitter<T>();
  /**
   * Event emitted when the page was changed.
   * Works for pagination as well as infinite scrolling.
   */
  @Output() page: EventEmitter<PageEvent> = new EventEmitter();
  /**
   * Event emitted when noOpFilter is turned on and the user enters
   * a search query into the filter input
   */
  @Output() search: EventEmitter<string> = new EventEmitter();
  /**
   * Event emitted when the displayed elements have changed.
   * Emitted value are the currently displayed elements.
   */
  @Output() renderedData: EventEmitter<T[]> = new EventEmitter();
  /**
   * Event emitted when the data has been filtered by the user.
   * Emitted value are the elements, which have tested positive against the current filter.
   */
  @Output() filteredData: EventEmitter<T[]> = new EventEmitter();
  /**
   * Event emitted when using backend pagination and the observable provided by getPage threw an error.
   * Emitted value is the error that has been thrown.
   */
  @Output() error: EventEmitter<any> = new EventEmitter();
  /**
   * Event emitted when the user clicks a row.
   * The input parameter rowClickable must be turned to true for this to work.
   * The emitted value is the model of the row that has been clicked.
   */
  @Output() rowClick: EventEmitter<T> = new EventEmitter<T>();
  /**
   * Event emitted when the user has changed the sorting.
   * Emitted value is the new sort setting.
   */
  @Output() sort: EventEmitter<Sort> = new EventEmitter<Sort>();

  matFrontendPaginator: MatPaginator;
  matBackendPaginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) matSort: MatSort;
  @ViewChild(MatTable, { static: true }) matTable: MatTable<T>;
  scrollContainer: ElementRef;

  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<T>;
  dataStatus: Map<T, DataStatus> = new Map<T, DataStatus>(); // to know whether or not a row is being edited
  private oldColumns: TableColumn<T, any>[] = []; // For dirty-checking
  addedItem: T = null;
  // There may only be one form control per cell
  // FormControls are identified by <rowIndex>_<colIndex>
  formControls: Map<string, AbstractControl> = new Map<string, AbstractControl>();
  colFilterFormControls = new Map<TableColumn<T, any>, AbstractControl>();

  isChrome = false;
  private lastFilterValue = '';
  private renderedDataSubscription: Subscription;
  // Trigger on data change
  refreshTrigger: number = 0;

  // Drag n drop
  // Contains the columns ids of the displayed columns and their tablecolumn objects
  columnIds: Map<string, TableColumn<T, any>> = new Map();
  actionIndex: number = -1;
  hasFooter: boolean = false;

  expandedElement: T | null;
  /**
   * When using expandable rows, we dont want to render all detail components at once
   * So we remove the detail component when not expanded
   * problem: the closing animation takes some time and we dont want the detail component to suddenly disappear before the animation is finished
   * solution: not only display the currently open detail component, but also the one opened before that
   */
  lastExpandedElement: T | null;
  buttonType = ButtonType;

  constructor(
    private fb: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    const win: any = window;
    this.isChrome = !!win.chrome;
    if (this.addable && !this.create) {
      throw Error('Seems like you enabled adding of elements (adding was set to true), but you did not supply a create function.' +
        ' Please specify a create function that will be used to create new Elements of your' +
        ' Model by binding to the create input parameter.');
    }
  }

  @ViewChild('frontendPaginator')
  set frontendPaginator(frontendPaginator: MatPaginator) {
    this.matFrontendPaginator = frontendPaginator; // May be set/unset multiple times if user changes input flags;
  }

  @ViewChild('backendPaginator')
  set backendPaginator(backendPaginator: MatPaginator) {
    this.matBackendPaginator = backendPaginator; // May be set/unset multiple times if user changes input flags;
  }

  @ViewChild('scrollContainer')
  set outerContainer(scrollContainer: ElementRef) {
    this.scrollContainer = scrollContainer; // May be set/unset multiple times if user changes input flags;
  }

  /**
   * Called when user changes order of columns
   * @param event
   */
  dropColumn(event: CdkDragDrop<string[]>) {
    const hasActions = this.displayedColumns.includes('actions');
    // For explanation of actual previous index see comment below
    let actualPreviousIndex;
    if (hasActions && this.actionIndex >= 0 && this.actionIndex <= event.previousIndex) {
      actualPreviousIndex = event.previousIndex + 1;
    } else {
      actualPreviousIndex = event.previousIndex;
    }
    const draggedColumnId = this.displayedColumns[actualPreviousIndex];
    const replacedColumnId = this.displayedColumns[event.currentIndex];
    // For whatever reason, the previousIndex is always the last index for the actions column
    // but only the previousIndex. The current index is correct.
    if (hasActions && event.previousIndex === this.displayedColumns.length - 1) {
      this.actionIndex = event.currentIndex;
      this.recreateDataSource();
    } else {
      const draggedColumn = this.columnIds.get(draggedColumnId);
      const draggedColumnIndex = this.columns.findIndex(column => column === draggedColumn);
      let replacedColumnIndex;
      if (replacedColumnId === 'actions') {
        let targetColumnIndex;
        if (actualPreviousIndex < this.actionIndex) {
          targetColumnIndex = event.currentIndex - 1;
          this.actionIndex--;
        } else {
          targetColumnIndex = event.currentIndex + 1;
          this.actionIndex++;
        }
        const targetColumnId = this.displayedColumns[targetColumnIndex];
        const replacedColumn = this.columnIds.get(targetColumnId);
        replacedColumnIndex = this.columns.findIndex(column => column === replacedColumn);
      } else {
        const replacedColumn = this.columnIds.get(replacedColumnId);
        replacedColumnIndex = this.columns.findIndex(column => column === replacedColumn);
        if (actualPreviousIndex > this.actionIndex && event.currentIndex < this.actionIndex) {
          this.actionIndex++;
        } else if (event.currentIndex > this.actionIndex && actualPreviousIndex < this.actionIndex) {
          this.actionIndex--;
        }
      }
      // DataSource (including displayedColumns) will be recreated
      // so we do not need to switch the position in displayedColumns; only in columns
      moveItemInArray(this.columns, draggedColumnIndex, replacedColumnIndex);
      this.recreateDataSource();
    }
  }


  /**
   * Sets DataSource filter using the search string from the search input field.
   *
   * @param filterValue
   */
  applyFilter(filterValue: string) {
    this.lastFilterValue = filterValue;
    if (this.noOpFilter) {
      this.search.emit(filterValue);
      return;
    }
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    if (this.dataSource.filter.length === 0 && this.hasColumnFilter()) {
      this.dataSource.filter = '  ';
    }
  }

  /**
   * Changes the data source filter so a new search is triggered.
   * Does not influence the search results.
   */
  applyColFilter() {
    const len = this.dataSource.filter.length - 1;
    if (this.dataSource.filter.charAt(len) !== ' ') {
      this.dataSource.filter = (this.dataSource.filter + ' ');
    } else {
      this.dataSource.filter = this.dataSource.filter.substring(0, len);
    }
    if (this.dataSource.filter === '') {
      this.dataSource.filter = '  ';
    }
  }

  /**
   * Method used when a cell or a button is clicked.
   * Executes the onClick function of the TableColumn.
   *
   * @param tcol Clicked Column
   * @param element Clicked element
   * @param fromButton true = button; false = cell
   * @param event mouse event
   */
  onClick(tcol: TableColumn<T, any>, element: T, fromButton: boolean, event: MouseEvent) {
    if (fromButton ? this.isButtonClickable(tcol) : this.isCellClickable(tcol, element)) {
      tcol.onClick(element[tcol.property], element, this.data, event);
    }
  }

  // start ---   Scrolling Methods
  /*
      Scrolling Events are relevant only for infiniteScrolling
      We have three different sources for scroll events:
      1. Scroll on simplemattable component - if simplemattable itself has a scrollbar
      2. Scroll on Parent - If a parent of simplemattable component has a scrollbar
      3. Scroll on Window - If no parent of simplemattable has a scrollbar
   */

  @HostListener('window:scroll', [])
  onScrollWindow() {
    if (!this.overflowAuto && !this.sticky && this.infiniteScrolling) {
      // In chrome and some browser scroll is given to body tag
      const clientHeight = document.documentElement.clientHeight;
      const pos = (document.documentElement.scrollTop || document.body.scrollTop) + clientHeight;
      const max = document.documentElement.scrollHeight;
      this.onScroll(clientHeight, pos, max);
    }
  }

  onScrollComponent(event) {
    if ((this.overflowAuto || this.sticky) && this.infiniteScrolling) {
      this.onScrollElement(event);
    }
  }

  onScrollParent(event) {
    if (!this.sticky && !this.overflowAuto && this.scrollContainer) {
      this.onScrollElement(event);
    }
  }

  private onScrollElement(event) {
    const ele = event.target;
    const clientHeight = ele.clientHeight;
    const pos = ele.scrollTop + clientHeight;
    const max = ele.scrollHeight;
    this.onScroll(clientHeight, pos, max);
  }

  /**
   * Method called when component or window has been scrolled and infinite scrolling for respective type is enabled.
   * @param clientHeight
   * @param pos
   * @param max
   */
  onScroll(clientHeight: number, pos: number, max: number) {

    // In case someone navigates to the page, one scroll event might be thrown
    // to reset the scroll position after the page has previously been scrolled
    if (!(clientHeight === pos && pos === max)) {
      this.infiniteScrollingHasScrolled = true;
    }
    let buffer;
    if (this.infiniteScrollingHeight.isPercent()) {
      buffer = clientHeight * this.infiniteScrollingHeight.getNumber();
    } else {
      buffer = this.infiniteScrollingHeight.getNumber();
    }
    if (pos >= max - buffer) {
      if (this.infiniteScrollingHasMore) {
        if (!this.loading) {
          this.infiniteScrollingPage++;
          // Scrolled to bottom, loading next page
          this.loadInfiniteScrollPage();
        } else {
          // Ignoring scroll to bottom since we are already loading
        }
      }
      // else => Ignoring scroll to bottom since there are no more items
    }
  }

  loadInfiniteScrollPage() {
    this.page.emit({
      pageIndex: this.infiniteScrollingPage,
      pageSize: this.infiniteScrollingPageSize,
      previousPageIndex: this.infiniteScrollingPage - 1,
      length: this.data.length
    });
    if (this.getPage) {
      this.loading = true;
      const subscription = this.getPage(this.infiniteScrollingPage, this.infiniteScrollingPageSize).subscribe(pageData => {
        subscription.unsubscribe();
        if (pageData.length < this.infiniteScrollingPageSize) {
          this.infiniteScrollingHasMore = false;
        }
        this.data.push(...pageData);
        this.onDataChanges();
        this.loading = false;
      }, error => {
        this.loading = false;
        this.error.emit(error);
      });
    }
  }

  getScrollParent(node: any): any | null {
    if (node == null) {
      return null;
    }
    if (node.scrollHeight > node.clientHeight && node.clientHeight > 0) {
      return node;
    } else {
      return this.getScrollParent(node.parentNode);
    }
  }

  // end   ---   Scrolling Methods

  getTableCellStyle(tcol: TableColumn<T, any>): { [p: string]: string } {
    if (tcol.width) {
      return { 'width': tcol.width.toString() };
    } else {
      return {};
    }
  }

  getTableRowClass(row: T): string | string[] | Object {
    if (this.rowNgClass) {
      let classes = this.rowNgClass(row, this.data);
      if (this.rowClickable) {
        classes = this.addClass(classes, 'on-click');
      }
      if (this.detailRowComponent) {
        classes = this.addClass(classes, 'smt-element-row');
      }
      return classes;
    } else {
      return { 'on-click': !!this.rowClickable, 'smt-element-row': !!this.detailRowComponent };
    }
  }

  private addClass(classes: string | string[] | Object, newClass: string): string | string[] | Object {
    if (typeof classes === 'string') {
      classes += ' ' + newClass;
    } else if (Array.isArray(classes)) {
      classes.push(newClass);
    } else if (typeof classes === 'object') {
      classes[newClass] = true;
    }
    return classes;
  }

  getTableFooterRowClass(): string | string[] | Object {
    if (this.footerRowNgClass) {
      return this.footerRowNgClass(this.data);
    } else {
      return {};
    }
  }

  getTableRowStyle(row: T): Object {
    if (this.rowNgStyle) {
      return this.rowNgStyle(row, this.data);
    } else {
      return {};
    }
  }

  getTableFooterRowStyle(): Object {
    if (this.footerRowNgStyle) {
      return this.footerRowNgStyle(this.data);
    } else {
      return {};
    }
  }

  getColFilterFormControl(tableColumn: TableColumn<T, any>): AbstractControl {
    return this.colFilterFormControls.get(tableColumn);
  }

  /**
   * Checks if all Form Fields of a row are valid.
   *
   * @param rowIndex
   * @returns boolean true = all form field of this row are valid
   */
  isFormValid(rowIndex: number): boolean {
    return this.iteratorToArray(this.formControls.entries())
      .filter((entry) => entry[0].startsWith(rowIndex.toString()))
      .map(entry => entry[1])
      .every(control => control.valid);
  }

  /**
   * With infinite scrolling you can not just switch to the appropriate page if you want to show a specific item like you can with pagination.
   * Instead, you can use this method to scroll to a specific index.
   *
   * The scrolling will be done so that the selected element will be the second element visible to the user.
   *
   * @param index index to scroll to. E.g. 50 will be the 51st row
   */
  set scrollToIndex(index: number) {
    if (!this.scrollContainer) {
      return;
    }
    const tablerows: HTMLCollectionOf<HTMLTableRowElement> = this.scrollContainer.nativeElement.getElementsByTagName('tr');
    if (tablerows.length === 0) {
      console.warn('Tried to scroll to index ', index, ' but there was no data to scroll to');
      return;
    }
    // we want to scroll in a way so that the row at index is the second row
    if (index > 0) {
      index--;
    }
    if (index > tablerows.length) {
      index = tablerows.length - 1;
    }
    this.scrollContainer.nativeElement.scrollTop = tablerows[index].offsetTop;
  }

  /**
   * Add a new element to the table using the supplied create method.
   * The new element will have the "added" status set to true.
   */
  startAddElement() {
    const ele: T = this.create();
    this.addedItem = ele;
    this.recreateDataSource();
    this.cleanUpAfterDataChange();
    const status = new DataStatus();
    status.added = true;
    status.editing = true;
    this.dataStatus.set(ele, status);
    // added item will be the first row, so row index = 0
    this.focusInput(0);
  }

  /**
   * Saves an edited or newly added element.
   * Emits either an add or an edit event.
   * The emitted value will be a deep copy of the oldElement with the new values from the from fields applied to it.
   *
   * @param rowIndex
   * @param oldElement the current model object without the modifications the user made in the form fields.
   */
  saveElement(rowIndex, oldElement: T) {
    // The id of a FormControl is <rowIndex>_<columnIndex>
    // so we can check if the id starts with the index to find all controls of that row
    const controls: { col: number, control: AbstractControl }[] = this.iteratorToArray(this.formControls.entries())
      .filter((entry) => entry[0].startsWith(rowIndex.toString()))
      .map(entry => ({ col: +(entry[0].split('_')[1]), control: entry[1] })); // need col index for later
    if (controls.some(control => !control.control.valid)) {
      return;
    }
    const element = this.deepCopy(oldElement); // Deep copy old object to not override table values
    controls.forEach(control => {
      const tcol: TableColumn<T, any> = this.getDisplayedCols(this.columns)[control.col];
      const val = control.control.value;
      if (element[tcol.property] instanceof Object && !(element[tcol.property] instanceof Date) && !tcol.formField.apply) {
        throw Error('Could not map value "' + val + '" to property "' + tcol.property + '". ' +
          'Please consider adding the onInit and onApply functions to the FormField of the "' + tcol.name + '"-column. ' +
          'For more information on this, see the simplemattable docs on npm or github.');
      }
      element[tcol.property] = tcol.formField.apply ? tcol.formField.apply(val, element[tcol.property], element, this.data) : val;
    });
    this.dataStatus.get(oldElement).loading = true;
    if (this.dataStatus.get(oldElement).added) {
      this.add.emit(element);
    } else {
      this.edit.emit(element);
    }
  }

  /**
   * Set the status of the element to edit
   * @param element
   * @param rowIndex for focus purposes
   */
  startEditElement(element: T, rowIndex: number) {
    const status = this.dataStatus.has(element) ? this.dataStatus.get(element) : new DataStatus();
    status.editing = true;
    this.dataStatus.set(element, status);
    this.startEdit.emit(element);
    this.focusInput(rowIndex);
  }

  private focusInput(rowIndex: number) {
    setTimeout(() => {
      const focusedElement = document.getElementById(rowIndex + '-smt-focus-input');
      if (focusedElement) {
        focusedElement.focus();
      }
    }, 150);
  }

  /**
   * Revert the status of the element. If the element was newly added, it will be removed from the table.
   * @param element
   */
  cancelEditElement(element: T) {
    const status = this.dataStatus.get(element);
    if (status.added) {
      this.clearAddedEntry();
      this.recreateDataSource();
      this.cleanUpAfterDataChange();
    } else {
      status.editing = false;
    }
    this.cancelEdit.emit(element);
  }

  /**
   * Emit delete event for the element
   * @param element
   */
  deleteElement(element: T) {
    this.dataStatus.get(element).loading = true;
    this.delete.emit(element);
  }


  deleteAllElements() {
    this.deleteAll.emit(this.data);
  }

  onPageEvent(pageEvent: PageEvent) {
    this.page.emit(pageEvent);
    if (this.getPage) {
      this.loading = true;
      this.getPage(pageEvent.pageIndex, pageEvent.pageSize).subscribe(pageData => {
        this.data = pageData;
        this.onDataChanges();
        this.loading = false;
      }, error => {
        this.loading = false;
        this.error.emit(error);
      });
    }
  }

  /*

      Next up are some simpler methods.
      Their name should suffice to understand their purpose,
      so I do not feel the necessity to write any JSDoc for them.

   */

  getStringRepresentation(tcol: TableColumn<T, any>, element: T): string {
    if (tcol.transform) {
      // Sadly, we cant use observables here as the datasource's filter function (for which this is used)
      // does not support returning observables
      return tcol.transform(element[tcol.property], element, this.data) + '';
    } else if (element[tcol.property] === null || element[tcol.property] === undefined) {
      return '';
    } else {
      return element[tcol.property].toString();
    }
  }

  private isButtonClickable = (tcol: TableColumn<T, any>) => tcol.onClick && tcol.button;
  private isCellClickable = (tcol: TableColumn<T, any>, element: T) => tcol.onClick && !tcol.button && !this.isEditing(element);

  isLoading = (element: T): boolean => this.dataStatus.get(element).loading;
  isEditing = (element: T): boolean => this.dataStatus.get(element).editing;
  getDisplayedCols = (cols: TableColumn<T, any>[]): TableColumn<T, any>[] => cols.filter(col => col.visible);
  getHeaderFilterAlign = (align: Align): string => align === Align.LEFT ? 'start end' : align === Align.CENTER ? 'center end' : 'end end';
  getHeaderNoFilterAlign = (align: Align): string => align === Align.LEFT ? 'start center' : align === Align.CENTER ? 'center center' : 'end center';

  getTextAlign = (align: Align): string => align === Align.LEFT ? 'start' : align === Align.CENTER ? 'center' : 'end';
  isCenterAlign = (tcol: TableColumn<T, any>): boolean => tcol.align === Align.CENTER;
  hasColumnFilter = (): boolean => this.getDisplayedCols(this.columns).some(tcol => tcol.colFilter);
  getTableHeaderStyle = (): Object => this.hasColumnFilter() ? { height: '100%' } : {};
  getTableClass = (): string => (this.sticky ? 'sticky-th' : 'non-sticky-th') + (this.isChrome ? ' chrome' : '');

  getOuterContainerStyle() {
    return {
      'overflow': (this.overflowAuto || this.sticky) ? 'auto' : 'visible',
      'position': 'relative',
      'flex': this.loading ? '1 0 200px' : '1 1 1e-09px' // Outer container is holding the progress spinner while loading
    };
  }

  iteratorToArray<Z>(iterator: IterableIterator<Z>): Z[] {
    const arr: Z[] = [];
    let res = iterator.next();
    while (!res.done) {
      arr.push(res.value);
      res = iterator.next();
    }
    return arr;
  }

  deepCopy(obj) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    if (obj instanceof Date) {
      return new Date(obj.getTime());
    }
    if (Array.isArray(obj)) {
      return obj.map(ele => ele);
    }
    const clonedObj = new obj.constructor();
    for (const prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        clonedObj[prop] = this.deepCopy(obj[prop]);
      }
    }
    return clonedObj;
  }

  /* -----------------------
      DIRTY CHECKING AND DATASOURCE REBUILDING
      It works like this:
      - Check for Changes in Data (ngOnChanges) or Columns (ngDoCheck)
      - If changes are found, recreate the DataSource,
          which includes reassigning the paginator and the sorting function
      - Datachanges and columnchanges each require some extra work (cleanup)
          e.g. to reset the row status
     ----------------------- */

  // checks for data changes
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data) {
      this.onDataChanges();
    }
    if (changes.pageSettings && this.pageSettings) {
      // When using pagination, the user can programmatically select a page and the page size
      // via the page settings object. The paginator selections are changed here.
      const hasIndex = !isNaN(this.pageSettings.pageIndex);
      const hasSize = !isNaN(this.pageSettings.pageSize);

      let paginator: MatPaginator;
      if (this.backendPagination && this.matBackendPaginator) {
        paginator = this.matBackendPaginator;
      } else if (this.paginator && this.matFrontendPaginator) {
        paginator = this.matFrontendPaginator;
      }
      if (paginator) {
        const previousIndex = paginator.pageIndex;
        if (hasIndex) {
          paginator.pageIndex = this.pageSettings.pageIndex;
        }
        if (hasSize) {
          paginator.pageSize = this.pageSettings.pageSize;
        }
        if (hasIndex || hasSize) {
          this.onPageEvent({
            previousPageIndex: previousIndex,
            length: paginator.length,
            pageIndex: paginator.pageIndex,
            pageSize: paginator.pageSize
          });
          if (this.matFrontendPaginator) {
            // with frontend pagination, the user expects simplemattable to change the data
            // this is the opposite of backend pagination, where the user has to fetch the data
            this.onDataChanges();
          }
        }
      } else if (this.infiniteScrolling) {
        // A changed size property will only need to be respected in future requests...
        if (hasSize) {
          this.infiniteScrollingPageSize = this.pageSettings.pageSize;
        }
        // ...index on the other hand will trigger a complete reload:
        if (hasIndex) {
          this.infiniteScrollingPage = this.pageSettings.pageIndex;
          // if the view is not yet initialized, we dont want to reload the page
          // as the initial load will take care of this
          if (this.scrollContainer) {
            this.data = [];
            this.onDataChanges(); // so old data is cleared in ui
            // scroll container might not be set if page setting is supplied at simplemattable creation
            if (this.overflowAuto || this.sticky) {
              this.scrollContainer.nativeElement.scrollTop = 0;
            }
            this.loadInfiniteScrollPage();
          }
        }
      }
    }
  }

  private onDataChanges(): void {
    this.clearAddedEntry();
    this.recreateDataSource();
    this.cleanUpAfterDataChange();
    this.refreshTrigger++;
  }

  private clearAddedEntry() {
    if (this.addedItem) {
      this.dataStatus.delete(this.addedItem);
      this.addedItem = null;
    }
  }

  private cleanUpAfterDataChange() {
    this.dataStatus.clear();
    if (this.data) {
      this.data.forEach(data => this.dataStatus.set(data, new DataStatus()));
    }
    this.formControls.clear();
    if (this.matSort && this.matSort.active) {
      this.dataSource.data = this.dataSource.sortData(this.dataSource.data, this.matSort);
    }
  }

  // checks for column changes
  ngDoCheck(): void {
    if (this.checkForDifferences()) {
      this.clearAddedEntry();
      this.turnOffSorting(); // If columns are changed, resorting might cause bugs
      this.recreateDataSource();
      this.cleanUpAfterColChange();
      this.recreateColFilters();
    }
  }

  private recreateColFilters() {
    this.colFilterFormControls.clear();
    let reapplyFilter = false;
    this.getDisplayedCols(this.columns)
      .filter(tcol => tcol.colFilter)
      .forEach(tcol => {
        const formControl = this.fb.control('');
        this.colFilterFormControls.set(tcol, formControl);
        const colFilterText = tcol.getColFilterText();
        if (!colFilterText.applied) {
          formControl.patchValue(colFilterText.text);
          colFilterText.applied = true;
          reapplyFilter = true;
        }
        if (tcol.searchFn) {
          formControl.valueChanges.subscribe(newValue => {
            tcol.searchFn(newValue);
          });
        }
      });
    if (reapplyFilter) {
      this.applyColFilter();
    }
  }

  private cleanUpAfterColChange() {
    this.dataStatus.forEach((value: DataStatus, key: T) => {
      this.dataStatus.set(key, new DataStatus());
    });
    this.formControls.clear();
    this.oldColumns = this.columns.map(col => Object.assign({}, col)); // copy cols to lose references
    this.clearAddedEntry();
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
      const tmpData = this.data.slice();
      if (this.addedItem) {
        tmpData.unshift(this.addedItem);
      }
      this.dataSource = new MatTableDataSource(tmpData);

      // Listen to data changes
      if (this.renderedDataSubscription) {
        this.renderedDataSubscription.unsubscribe();
      }
      this.renderedDataSubscription = this.dataSource.connect().subscribe((data) => {
        this.renderedData.emit(data);
        this.filteredData.emit(this.dataSource.filteredData);
      });

      // Filter
      this.dataSource.filterPredicate = (data: T, filter: string) => {
        const filterWords = filter.toLowerCase().trim().split(' ');
        const allString = this.columns.reduce((str, col) => str + this.getStringRepresentation(col, data).toLowerCase().trim(), '');
        const allFilterOk = filterWords.every(word => allString.indexOf(word) > -1);
        if (!this.hasColumnFilter() || !allFilterOk) {
          return allFilterOk;
        }

        // Iterate over colFilterMap to apply filters
        const mapEntries = this.colFilterFormControls.entries();
        let entry = mapEntries.next();
        while (!entry.done) {
          const tcol: TableColumn<T, any> = entry.value[0];
          const control: FormControl = entry.value[1];
          if (tcol.filterFn) {
            // custom filter
            if (!tcol.filterFn(control.value, data[tcol.property], data)) {
              return false;
            }
          } else {
            // default behaviour
            if (this.getStringRepresentation(tcol, data).toLowerCase().trim().indexOf(control.value.toString().toLowerCase().trim()) === -1) {
              return false;
            }
          }

          entry = mapEntries.next();
        }
        return true;
      };

      // Pagination
      if (this.paginator && !this.backendPagination) {
        this.dataSource.paginator = this.matFrontendPaginator;
      }

      // Sorting
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

      // Filter columns to display and footer-detection
      this.columnIds.clear();
      let hasFooter = false; // we only want to display the footer if a visible column has the footer function
      // Dont assign displayedColumns directly as view gets updated when reference changes
      const displayedColumns = this.getDisplayedCols(this.columns).map((col, i) => {
        if (col.footer) {
          hasFooter = true;
        }
        const columnId = i.toString() + '_' + col.property;
        this.columnIds.set(columnId, col);
        return columnId;
      });
      this.hasFooter = hasFooter;
      if (this.editable || this.addable || this.deletable) {
        if (this.actionIndex >= 0) {
          displayedColumns.splice(this.actionIndex, 0, 'actions');
        } else {
          this.actionIndex = displayedColumns.length;
          displayedColumns.push('actions');
        }
      }
      this.displayedColumns = displayedColumns;

      if (this.filter || this.hasColumnFilter()) {
        this.applyFilter(this.lastFilterValue);
      }

      // Scrolling
      if (this.infiniteScrolling) {

        // Register scroll listener
        if (!this.sticky && !this.overflowAuto && this.scrollContainer) {
          const parentWithScroll = this.getScrollParent(this.scrollContainer.nativeElement);
          if (parentWithScroll) {
            parentWithScroll.onscroll = (event) => {
              this.onScrollParent(event);
            };
          }
        }

        // start loading if screen not filled
        setTimeout(() => {
          // If the posts do not fill the whole screen, scolling down might not work, so the user has no chance to reload
          // Therefore, load posts until a scrollbar appears or all posts are loaded
          if (!this.infiniteScrollingHasScrolled && this.infiniteScrollingHasMore && !this.loading) {
            let pos;
            let max;
            if (this.sticky || this.overflowAuto) {
              // Component scroll
              const ele = this.scrollContainer.nativeElement;
              pos = ele.clientHeight;
              max = ele.scrollHeight;
            } else {
              const parent = this.getScrollParent(this.scrollContainer.nativeElement);
              if (parent) {
                pos = parent.scrollTop + parent.clientHeight;
                max = parent.scrollHeight;
              } else {
                // Window scroll
                pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.clientHeight;
                max = document.documentElement.scrollHeight;
              }
            }
            if (pos === max) {
              this.infiniteScrollingPage++;
              this.loadInfiniteScrollPage();
            }
          }
        }, 500);
      }
    }
  }

  ngAfterViewInit(): void {
    if (this.paginator && this.dataSource && !this.backendPagination) {
      this.dataSource.paginator = this.matFrontendPaginator;
    }
    if (this.sorting && this.dataSource) {
      this.dataSource.sort = this.matSort;
    }
    // setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
    // we cant place this in the ngOnInit method because the view is not yet initialized
    // and so the layout will be buggy (e.g. neglecting specified height) if we start loading immediately
    setTimeout(() => {
      if (this.paginator) {
        this.onPageEvent({
          pageSize: this.paginatorPageSize,
          pageIndex: 0,
          length: 0,
          previousPageIndex: 0
        });
      } else if (this.infiniteScrolling) {
        this.loadInfiniteScrollPage();
      }
    });
  }

  rowClicked(row: T) {
    this.rowClick.emit(row);
    this.lastExpandedElement = this.expandedElement;
    if (this.expandedElement === row) {
      this.expandedElement = null;
    } else {
      this.expandedElement = row;
    }
  }

  sortChanged(sortEvent: Sort) {
    this.sort.emit(sortEvent);
  }

}
