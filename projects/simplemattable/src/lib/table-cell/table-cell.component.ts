import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TableColumn} from '../model/table-column.model';
import {Align} from '../model/align.model';
import {ButtonType} from '../model/button-type.model';
import {FormFieldType} from '../model/form-field-type.model';
import {SaveEvent} from '../model/table-cell-events.model';
import {AbstractControl, FormBuilder} from '@angular/forms';
import {FormError} from '../model/form-error.model';

@Component({
  selector: 'smc-table-cell',
  templateUrl: './table-cell.component.html',
  styleUrls: ['./table-cell.component.css']
})
export class TableCellComponent<T> implements OnInit {
  // Enums
  buttonType = ButtonType;
  formFieldType = FormFieldType;
  // Inputs
  tableColumn: TableColumn<any, any>;
  element: T;
  editing: boolean = false;
  @Input()
  rowIndex: number;
  @Input()
  columnIndex: number;
  @Input()
  formControls: Map<string, AbstractControl>;
  // Outputs
  @Output()
  save = new EventEmitter<SaveEvent<T>>();
  // State derived from inputs
  formControl: AbstractControl;
  cellAlign: string = '';
  cellCssClass: Object = {};
  cellCssStyle: Object = {};
  cellType: TableColumnDisplayType = 'text';
  inputCssStyle: Object = {};
  inputId: string = '';
  buttonDisabled: boolean = false;
  iconName: string = '';
  stringRepresentation: string = '';

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
  }

  @Input()
  set tableColumnInput(tableColumn: TableColumn<T, any>) {
    this.tableColumn = tableColumn;
    this.updateTableColumn();
    this.updateTableColumnAndData();
    this.updateTableColumnAndEditing();
  }

  @Input()
  set dataParent(parent: T) {
    this.element = parent;
    this.updateTableColumnAndData();
  }

  @Input() set isEditing(editing: boolean) {
    this.editing = editing;
    this.updateTableColumnAndEditing();
  }

  // Update methods

  private updateTableColumn() {
    // Updates that only are affected by the table column
    this.cellAlign = this.getCellAlign(this.tableColumn.align);
    this.inputCssStyle = {'text-align': this.getTextAlign(this.tableColumn.align)};
    this.inputId = this.tableColumn.formField.focus ? this.rowIndex + '-smt-focus-input' : '';
  }

  private updateTableColumnAndData() {
    // All updates that require table column AND data
    if (this.tableColumn && this.element) {
      this.cellCssClass = this.getCellCssClass(this.tableColumn, this.element);
      this.cellCssStyle = this.getCellCssStyle(this.tableColumn, this.element);
      this.buttonDisabled = this.isButtonDisabled(this.tableColumn, this.element);
      this.stringRepresentation = this.getStringRepresentation(this.tableColumn, this.element);
      console.log('String representation: ' + this.stringRepresentation);
      if (this.tableColumn.icon) {
        this.iconName = this.getIconName(this.tableColumn, this.element);
      }
    }
  }

  private updateTableColumnAndEditing() {
    // All updates that require table column AND editing state
    if (this.tableColumn) {
      this.cellType = this.getTableCellType(this.tableColumn, this.editing);
      if (this.cellType === 'form') {
        this.formControl = this.getFormControl(this.rowIndex, this.columnIndex, this.tableColumn, this.element);
      }
    }
  }


  // Calculations and actions

  directEditElementChanged(tcol: TableColumn<T, any>, element: T, newValue) {
    if (tcol.formField.onDirectEditModelChange) {
      tcol.formField.onDirectEditModelChange(newValue, element[tcol.property], element);
    } else {
      element[tcol.property] = newValue;
    }
  }

  /**
   * Returns all errors associated with the form control at table cell rowIndex:colIndex that are currently active.
   *
   * @param tableColumn
   * @param formControl
   * @returns List of FormError objects that are currently active (their condition is met)
   */
  getCurrentErrors(tableColumn: TableColumn<T, any>, formControl: AbstractControl): FormError[] {
    return tableColumn.formField.errors.filter(error => formControl.hasError(error.key));
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

  /**
   * Method used when a cell or a button is clicked.
   * Executes the onClick function of the TableColumn.
   *
   * @param tcol Clicked Column
   * @param element Clicked element
   */
  onClick(tcol: TableColumn<T, any>, element: T) {
    if (this.isButtonClickable(tcol)) {
      tcol.onClick(element[tcol.property], element);
    }
  }

  private isButtonClickable = (tcol: TableColumn<T, any>) => tcol.onClick && tcol.button;
  isButtonDisabled = (tcol: TableColumn<T, any>, element: T): boolean => tcol.disabledFn ? tcol.disabledFn(element[tcol.property], element) : false;
  isEditingColumn = (tcol: TableColumn<T, any>, editing: boolean): boolean => tcol.formField && !tcol.directEdit && editing;
  getIconName = (tcol: TableColumn<T, any>, element: T) => tcol.icon(element[tcol.property], element);

  getStringRepresentation(tcol: TableColumn<T, any>, element: T): string {
    if (tcol.transform) {
      return tcol.transform(element[tcol.property], element);
    } else if (element[tcol.property] === null || element[tcol.property] === undefined) {
      return '';
    } else {
      return element[tcol.property].toString();
    }
  }

  getTableCellType(tcol: TableColumn<T, any>, editing: boolean): TableColumnDisplayType {
    if (tcol.button) {
      return 'button';
    }
    if (this.isEditingColumn(tcol, editing)) {
      return 'form';
    }
    if (tcol.directEdit && tcol.formField) {
      return 'directEdit';
    }
    if (tcol.ngComponent) {
      return 'component';
    }
    return 'text';
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
    baseValue['textAlign'] = this.getTextAlign(tcol.align);
    if (tcol.heightFn) {
      const height = tcol.heightFn(element[tcol.property], element);
      if (height) {
        baseValue['height'] = height.toString();
      }
    } else {
      baseValue['minHeight'] = '48px';
    }
    return baseValue;
  }

  getTextAlign = (align: Align): string => align === Align.LEFT ? 'start' : align === Align.CENTER ? 'center' : 'end';

  private getCellAlign = (align: Align): string => align === Align.LEFT ? 'start center' : align === Align.CENTER ? 'center center' : 'end center';

  /**
   * Uses the TableColumn ngClass property to create the ngStyle Object for a table cell.
   * May also include some internal css classes.
   *
   * @param tcol TableColumn
   * @param element the element
   * @returns ngClass Object
   */
  private getCellCssClass(tcol: TableColumn<T, any>, element: T): Object {
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

  private arrayToObject(arr: string[]): Object { // turn ['css-class-a', 'css-class-b'] into {'css-class-a': true, 'css-class-b': true}
    return arr.reduce((acc, entry) => {
      acc[entry] = true;
      return acc;
    }, {});
  }
}

type TableColumnDisplayType = 'text' | 'button' | 'directEdit' | 'form' | 'component';
