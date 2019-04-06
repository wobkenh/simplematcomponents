import {AfterViewInit, Component, DoCheck, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {TableColumn} from '../model/table-column.model';
import {MatPaginator, MatSort, MatTable, MatTableDataSource} from '@angular/material';
import {Align} from '../model/align.model';
import {ButtonType} from '../model/button-type.model';
import {AbstractControl, FormBuilder} from '@angular/forms';
import {FormFieldType} from '../model/form-field-type.model';
import {DataStatus} from '../model/data-status.model';
import {FormError} from '../model/form-error.model';

@Component({
  selector: 'smc-simplemattable',
  templateUrl: './simplemattable.component.html',
  styleUrls: ['./simplemattable.component.css']
})
export class SimplemattableComponent<T> implements OnInit, DoCheck, OnChanges, AfterViewInit {

  @Input() data: T[] = [];
  @Input() columns: TableColumn<T, any>[] = [];
  @Input() filter: boolean = false;
  @Input() paginator: boolean = false;
  @Input() sorting: boolean = false;
  @Input() paginatorPageSize: number = 10;
  @Input() paginatorPageSizeOptions: number[] = [5, 10, 20];
  @Input() editable: boolean = false;
  @Input() addable: boolean = false;
  @Input() deletable: boolean = false;
  @Input() editIcon: string;
  @Input() addIcon: string;
  @Input() deleteIcon: string;
  @Input() saveIcon: string;
  @Input() cancelIcon: string;
  @Input() create: () => T;
  @Input() sticky: boolean = false;

  @Output() delete: EventEmitter<T> = new EventEmitter<T>();
  @Output() edit: EventEmitter<T> = new EventEmitter<T>();
  @Output() add: EventEmitter<T> = new EventEmitter<T>();


  @ViewChild(MatPaginator) matPaginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;
  @ViewChild(MatTable) matTable: MatTable<T>;

  displayedColumns = [];
  dataSource: MatTableDataSource<T>;
  currentlyAdding: boolean = false;
  private dataStatus: Map<T, DataStatus> = new Map<T, DataStatus>(); // to know whether or not a row is being edited
  private oldColumns: TableColumn<T, any>[] = []; // For dirty-checking
  // There may only be one form control per cell
  // FormControls are identified by <rowIndex>_<colIndex>
  formControls: Map<string, AbstractControl> = new Map<string, AbstractControl>();
  colFilterFormControls = new Map<TableColumn<T, any>, AbstractControl>();

  buttonType = ButtonType;
  formFieldType = FormFieldType;


  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    if (this.addable && !this.create) {
      throw Error('Seems like you enabled adding of elements (adding was set to true), but you did not supply a create function.' +
        ' Please specify a create function that will be used to create new Elements of your' +
        ' Model by binding to the create input parameter.');
    }
  }

  /**
   * Sets DataSource filter using the search string from the search input field.
   *
   * @param filterValue
   */
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    if (this.dataSource.filter.length === 0 && this.hasColumnFilter()) {
      this.dataSource.filter = '  ';
    }
  }

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
   */
  onClick(tcol: TableColumn<T, any>, element: T, fromButton: boolean) {
    if (fromButton ? this.isButtonClickable(tcol) : this.isCellClickable(tcol, element)) {
      tcol.onClick(element[tcol.property], element);
    }
  }

  /**
   * Uses the TableColumn ngClass property to create the ngStyle Object for a table cell.
   * May also include some internal css classes.
   *
   * @param tcol TableColumn
   * @param element the element
   * @returns ngClass Object
   */
  getCellCssClass(tcol: TableColumn<T, any>, element: T): Object {
    const defaultClass = {'filler-div': true, 'on-click': (tcol.onClick && !tcol.button)};
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

  /**
   * Uses the TableColumn ngStyle property to create the ngStyle Object for a table cell.
   * May also include some internal css properties.
   *
   * @param tcol
   * @param element
   * @returns ngStyleObject
   */
  getCellCssStyle(tcol: TableColumn<T, any>, element: T): Object {
    const baseValue = tcol.ngStyle ? tcol.ngStyle(element[tcol.property], element) : {};
    if (tcol.heightFn) {
      const height = tcol.heightFn(element[tcol.property], element);
      if (height) {
        baseValue['height'] = height;
      }
    }
    return baseValue;
  }

  getTableCellStyle(tcol: TableColumn<T, any>): { [p: string]: string } {
    if (tcol.width) {
      return {'width': tcol.width.toString()};
    } else {
      return {};
    }
  }


  /**
   * Returns the form control for a cell. If not currently present, it will create a new FormControl.
   * The cell is identified by its rowIndex and colIndex.
   *
   * @param colIndex
   * @param rowIndex
   * @param tcol tcol, used to set the initial value + validators if creation of a new control is necessary
   * @param element Element, used to set the initial value if creation of a new control is necessary
   * @returns AbstractFormControl
   */
  getFormControl(rowIndex: number, colIndex: number, tcol: TableColumn<T, any>, element: T): AbstractControl {
    const id = rowIndex + '_' + colIndex;
    if (this.formControls.has(id)) {
      return this.formControls.get(id);
    } else {
      const initialValue = tcol.formField.init ? tcol.formField.init(element[tcol.property], element) : element[tcol.property];
      const control = this.fb.control(initialValue, tcol.formField.validators);
      this.formControls.set(id, control);
      return control;
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
   * Returns all errors associated with the form control at table cell rowIndex:colIndex that are currently active.
   *
   * @param rowIndex
   * @param colIndex
   * @param tcol
   * @param element
   * @returns List of FormError objects that are currently active (their condition is met)
   */
  getCurrentErrors(rowIndex: number, colIndex: number, tcol: TableColumn<T, any>, element: T): FormError[] {
    const formField = this.getFormControl(rowIndex, colIndex, tcol, element);
    return tcol.formField.errors.filter(error => formField.hasError(error.key));
  }

  /**
   * Add a new element to the table using the supplied create method.
   * The new element will have the "added" status set to true.
   */
  startAddElement() {
    const ele: T = this.create();
    this.data.unshift(ele);
    this.recreateDataSource();
    this.cleanUpAfterDataChange();
    const status = new DataStatus();
    status.added = true;
    status.editing = true;
    this.dataStatus.set(ele, status);
    this.currentlyAdding = true;
    this.focusInput();
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
      .map(entry => ({col: +(entry[0].split('_')[1]), control: entry[1]})); // need col index for later
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
      element[tcol.property] = tcol.formField.apply ? tcol.formField.apply(val, element[tcol.property], element) : val;
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
   */
  startEditElement(element: T) {
    const status = this.dataStatus.has(element) ? this.dataStatus.get(element) : new DataStatus();
    status.editing = true;
    this.dataStatus.set(element, status);
    this.focusInput();
  }

  private focusInput() {
    setTimeout(() => {
      const focusedElement = document.getElementById('smt-focus-input');
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
      this.data.splice(this.data.indexOf(element), 1);
      this.currentlyAdding = false;
      this.recreateDataSource();
      this.cleanUpAfterDataChange();
    } else {
      status.editing = false;
    }
  }

  /**
   * Emit delete event for the element
   * @param element
   */
  deleteElement(element: T) {
    this.dataStatus.get(element).loading = true;
    this.delete.emit(element);
  }

  /*

      Next up are some simpler methods.
      Their name should suffice to understand their purpose,
      so I do not feel the necessity to write any JSDoc for them.

   */

  getStringRepresentation(tcol: TableColumn<T, any>, element: T): string {
    if (tcol.transform) {
      return tcol.transform(element[tcol.property], element);
    } else if (element[tcol.property] === null || element[tcol.property] === undefined) {
      return '';
    } else {
      return element[tcol.property].toString();
    }
  }

  private isButtonClickable = (tcol: TableColumn<T, any>) => tcol.onClick && tcol.button;
  private isCellClickable = (tcol: TableColumn<T, any>, element: T) => tcol.onClick && !tcol.button && !this.isEditing(element);

  getFormFieldMaxLines = (formField) => formField.maxLines;
  getFormFieldMinLines = (formField) => formField.minLines;
  getFormFieldOptions = (formField) => formField.options;
  isLoading = (element: T): boolean => this.dataStatus.get(element).loading;
  isEditing = (element: T): boolean => this.dataStatus.get(element).editing;
  isEditingColumn = (tcol: TableColumn<T, any>, element: T): boolean => tcol.formField && this.isEditing(element);
  getIconName = (tcol: TableColumn<T, any>, element: T) => tcol.icon(element[tcol.property], element);
  getDisplayedCols = (cols: TableColumn<T, any>[]): TableColumn<T, any>[] => cols.filter(col => col.visible);
  getFxFlex = (tcol: TableColumn<T, any>): string => tcol.width ? tcol.width : '1 1 0px';
  getHeaderFilterAlign = (align: Align): string => align === Align.LEFT ? 'start end' : align === Align.CENTER ? 'center end' : 'end end';
  getHeaderNoFilterAlign = (align: Align): string => align === Align.LEFT ? 'start center' : align === Align.CENTER ? 'center center' : 'end center';
  getCellAlign = (align: Align): string => align === Align.LEFT ? 'start center' : align === Align.CENTER ? 'center center' : 'end center';
  getTextAlign = (align: Align): string => align === Align.LEFT ? 'start' : align === Align.CENTER ? 'center' : 'end';
  isCenterAlign = (tcol: TableColumn<T, any>): boolean => tcol.align === Align.CENTER;
  isLeftAlign = (tcol: TableColumn<T, any>): boolean => tcol.align === Align.LEFT;
  hasColumnFilter = (): boolean => this.getDisplayedCols(this.columns).some(tcol => tcol.colFilter);
  getTableHeaderStyle = (): Object => this.hasColumnFilter() ? {height: '100%'} : {};
  getTableClass = (): string => this.sticky ? 'sticky-th' : 'non-sticky-th';

  arrayToObject(arr: string[]): Object { // turn ['css-class-a', 'css-class-b'] into {'css-class-a': true, 'css-class-b': true}
    return arr.reduce((acc, entry) => {
      acc[entry] = true;
      return acc;
    }, {});
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
      this.clearAddedEntry();
      this.recreateDataSource();
      this.cleanUpAfterDataChange();
    }
  }

  private clearAddedEntry() {
    let toDelete: T;
    this.dataStatus.forEach((value: DataStatus, key: T) => {
      if (value.added) {
        toDelete = key;
        this.data.splice(this.data.indexOf(key), 1);
      }
    });
    if (toDelete) {
      this.dataStatus.delete(toDelete);
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
    this.currentlyAdding = false;
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
    this.getDisplayedCols(this.columns)
      .filter(tcol => tcol.colFilter)
      .forEach(tcol => {
        this.colFilterFormControls.set(tcol, this.fb.control(''));
      });
  }

  private cleanUpAfterColChange() {
    this.dataStatus.forEach((value: DataStatus, key: T) => {
      this.dataStatus.set(key, new DataStatus());
    });
    this.formControls.clear();
    this.oldColumns = this.columns.map(col => Object.assign({}, col)); // copy cols to lose references
    this.currentlyAdding = false;
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
      this.dataSource.filterPredicate = (data: T, filter: string) => {
        const allFilter = this.columns.reduce((str, col) => str + this.getStringRepresentation(col, data).toLowerCase().trim(), '')
          .indexOf(filter.toLowerCase().trim()) >= 0;
        if (!this.hasColumnFilter() || !allFilter) {
          return allFilter;
        }

        // Iterate over colFilterMap to apply filters
        const mapEntries = this.colFilterFormControls.entries();
        let entry = mapEntries.next();
        while (!entry.done) {
          const tcol = entry.value[0];
          const control = entry.value[1];
          if (this.getStringRepresentation(tcol, data).toLowerCase().trim().indexOf(control.value.toString().toLowerCase().trim()) === -1) {
            return false;
          }
          entry = mapEntries.next();
        }
        return true;
      };


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
      if (this.editable || this.addable || this.deletable) {
        this.displayedColumns.push('actions');
      }
    }
  }

  ngAfterViewInit(): void {
    if (this.paginator && this.dataSource) {
      this.dataSource.paginator = this.matPaginator;
    }
    if (this.sorting && this.dataSource) {
      this.dataSource.sort = this.matSort;
    }
  }
}
