import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {TableColumn} from '../model/table-column.model';
import {ButtonType} from '../model/button-type.model';
import {SaveEvent} from '../model/table-cell-events.model';
import {AbstractControl, UntypedFormBuilder} from '@angular/forms';
import {FormError} from '../model/form-error.model';
import {ExternalComponentWrapperComponent} from '../external-component-wrapper/external-component-wrapper.component';
import {AbstractFormField} from '../model/abstract-form-field.model';
import {SelectFormFieldOption} from '../model/select-form-field-option.model';
import {FormFieldType} from '../model/form-field-type.model';
import {LargeTextFormField} from '../model/large-text-form-field.model';
import {SelectFormField} from '../model/select-form-field.model';
import {SmcUtilService} from '../smc-util.service';
import {isObservable, Observable, of, Subscription} from 'rxjs';
import {SmcBreakpointService} from '../smc-breakpoint.service';
import {SmcStateService} from '../smc-state.service';

@Component({
  selector: 'smc-table-cell',
  templateUrl: './table-cell.component.html',
  styleUrls: ['./table-cell.component.css']
})
export class TableCellComponent<T> implements OnInit, OnDestroy {

  // Enums
  buttonType = ButtonType;
  formFieldType = FormFieldType;

  // Internal State
  tableColumn: TableColumn<any, any>;
  formField: AbstractFormField<any, any, any>;
  element: T;
  editing: boolean;
  added: boolean;

  // Inputs
  @Input()
  rowIndex: number;
  @Input()
  columnIndex: number;
  @Input()
  formControls: Map<string, AbstractControl>;
  @Input()
  dataList: T[];
  @Input()
  stateService: SmcStateService<T>;

  // Outputs
  @Output()
  save = new EventEmitter<SaveEvent<T>>();

  // State derived from inputs
  @ViewChild(ExternalComponentWrapperComponent) externalComponents: ExternalComponentWrapperComponent;
  formControl: AbstractControl;
  valueChangesSubscription: Subscription; // for cleanup
  cellCssClass: Object = {};
  tableColumnCellCssStyle: Object = {}; // css generated from table column
  cellCssStyle: Object = {}; // css generated from table column and data
  cellType: TableColumnDisplayType = 'text';
  inputCssStyle: Object = {};
  inputId: string = '';
  buttonDisabled: boolean = false;
  iconName: string = '';
  stringRepresentation: string | number = '';
  tooltip: string;
  textHiddenXs: boolean;
  textHiddenSm: boolean;

  @Input()
  minHeight: number = 48;

  constructor(
    private fb: UntypedFormBuilder,
    private utilService: SmcUtilService,
    public bpService: SmcBreakpointService,
  ) {
  }

  ngOnDestroy(): void {
    if (this.valueChangesSubscription) {
      this.valueChangesSubscription.unsubscribe();
    }
  }

  ngOnInit() {
  }

  @Input()
  set tableColumnInput(tableColumn: TableColumn<T, any>) {
    this.tableColumn = tableColumn;
    this.updateTableColumn();
    this.updateTableColumnAndData();
    this.updateTableColumnAndEditing();
    this.updateTableColumnAndAdding();
  }

  @Input()
  set dataParent(parent: T) {
    this.element = parent;
    this.updateTableColumnAndData();
  }

  @Input()
  set isAdding(added: boolean) {
    this.added = added;
    this.updateTableColumnAndAdding();
  }

  @Input()
  set isEditing(editing: boolean) {
    this.editing = editing;
    this.updateTableColumnAndEditing();
  }

  @Input()
  set refreshTrigger(refreshTrigger: number) {
    if (this.externalComponents) {
      this.externalComponents.refreshInput();
    }
    this.updateTableColumnAndData();
  }

  // Update methods

  private updateTableColumn() {
    // Updates that only are affected by the table column
    this.inputCssStyle = {'text-align': this.utilService.getTextAlign(this.tableColumn.align)};
    this.tableColumnCellCssStyle['justifyContent'] = this.utilService.getCellAlign(this.tableColumn.align);
    this.textHiddenXs = this.tableColumn.textHiddenXs || this.tableColumn.textHiddenSm;
    this.textHiddenSm = this.tableColumn.textHiddenSm;
  }

  private updateTableColumnAndData() {
    // All updates that require table column AND data
    if (this.tableColumn && this.element) {
      this.cellCssClass = this.getCellCssClass(this.tableColumn, this.element);
      this.cellCssStyle = this.getCellCssStyle(this.tableColumn, this.element);
      this.cellCssStyle['justifyContent'] = this.tableColumnCellCssStyle['justifyContent'];
      this.buttonDisabled = this.isButtonDisabled(this.tableColumn, this.element);
      this.getStringRepresentation(this.tableColumn, this.element).subscribe(transformed => {
        this.stringRepresentation = transformed;
        this.stateService.putStringRepresentation(this.element, this.tableColumn, this.stringRepresentation);
      });
      this.tooltip = this.tableColumn.tooltip ? this.getTooltip(this.tableColumn, this.element) : undefined;
      if (this.tableColumn.icon) {
        this.iconName = this.getIconName(this.tableColumn, this.element);
      }
    }
  }

  getCellCssClass(tcol: TableColumn<T, any>, element: T): Object {
    const defaultClass = {'filler-div': true, 'on-click': (tcol.onClick && !tcol.button)};
    const ngClass = tcol.ngClass ? tcol.ngClass(element[tcol.property], element, this.dataList) : null;
    return this.utilService.getCellCssClass(tcol, ngClass, defaultClass);
  }

  private updateTableColumnAndEditing() {
    // All updates that require table column AND editing state
    if (this.tableColumn) {
      this.cellType = this.getTableCellType(this.tableColumn, this.editing);
      if (this.cellType === 'form') {
        if (this.valueChangesSubscription) {
          // form control will be replaced - get rid of old subscription to avoid memory leak
          this.valueChangesSubscription.unsubscribe();
        }
        this.formControl = this.getFormControl(this.rowIndex, this.columnIndex, this.tableColumn, this.element);
      }
    }
  }


  private updateTableColumnAndAdding() {
    // All updates that require table column AND adding state
    if (this.tableColumn) {
      // We now know if we are adding or not, so we can now decide on which form control to use
      if (this.tableColumn.addFormField && this.added) {
        this.formField = this.tableColumn.addFormField;
      } else if (this.tableColumn.editFormField && !this.added) {
        this.formField = this.tableColumn.editFormField;
      } else {
        this.formField = this.tableColumn.formField;
      }
      if (this.formField) {
        this.inputId = this.formField.focus ? this.rowIndex + '-smt-focus-input' : '';
      }
    }
  }

  // Methods for access to attributes of specific form field classes
  // We cant cast in html and we want to be type safe, so here we go

  getMaxLines(formField: AbstractFormField<any, any, any>): number {
    if (formField.formType === FormFieldType.LARGE_TEXT) {
      const largeTextFormField = formField as LargeTextFormField<any, any>;
      return largeTextFormField.maxLines;
    }
  }

  getMinLines(formField: AbstractFormField<any, any, any>): number {
    if (formField.formType === FormFieldType.LARGE_TEXT) {
      const largeTextFormField = formField as LargeTextFormField<any, any>;
      return largeTextFormField.maxLines;
    }
  }

  getOptions(formField: AbstractFormField<any, any, any>): SelectFormFieldOption<any>[] {
    if (formField.formType === FormFieldType.SELECT) {
      const selectFormField = formField as SelectFormField<any, any, any>;
      return selectFormField.options;
    }
  }

  // Calculations and actions

  directEditElementChanged(tcol: TableColumn<T, any>, element: T, newValue) {
    if (tcol.formField.onDirectEditModelChange) {
      tcol.formField.onDirectEditModelChange(newValue, element[tcol.property], element, this.dataList);
    } else {
      element[tcol.property] = newValue;
    }
  }

  /**
   * Returns all errors associated with the form control at table cell rowIndex:colIndex that are currently active.
   *
   * @param formControl
   * @returns List of FormError objects that are currently active (their condition is met)
   */
  getCurrentErrors(formControl: AbstractControl): FormError[] {
    return this.formField.errors.filter(error => formControl.hasError(error.key));
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
      const initialValue = this.formField.init ? this.formField.init(element[tcol.property], element, this.dataList) : element[tcol.property];
      const control = this.fb.control(initialValue, this.formField.validators, this.formField.asyncValidators);
      if (this.formField.valueChanges) {
        this.valueChangesSubscription = control.valueChanges.subscribe(value => {
          this.formField.valueChanges(value, element[tcol.property], element, this.dataList);
        });
      }
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
  onClick(tcol: TableColumn<T, any>, element: T, event: MouseEvent) {
    if (this.isButtonClickable(tcol)) {
      tcol.onClick(element[tcol.property], element, this.dataList, event);
    }
  }

  private isButtonClickable = (tcol: TableColumn<T, any>) => tcol.onClick && tcol.button;
  isEditingColumn = (tcol: TableColumn<T, any>, editing: boolean): boolean => this.formField && !tcol.directEdit && editing;
  getIconName = (tcol: TableColumn<T, any>, element: T) => tcol.icon(element[tcol.property], element, this.dataList);
  getTooltip = (tcol: TableColumn<T, any>, element: T) => tcol.tooltip(element[tcol.property], element, this.dataList);

  isButtonDisabled(tcol: TableColumn<T, any>, element: T): boolean {
    return tcol.disabledFn
      ? tcol.disabledFn(element[tcol.property], element, this.dataList) : false;
  }

  getStringRepresentation(tcol: TableColumn<T, any>, element: T): Observable<string | number> {
    if (tcol.transform) {
      const transformed = tcol.transform(element[tcol.property], element, this.dataList);
      if (isObservable(transformed)) {
        return transformed;
      } else {
        return of(transformed);
      }
    } else if (element[tcol.property] === null || element[tcol.property] === undefined) {
      return of('');
    } else {
      const value = element[tcol.property];
      if (typeof value === 'number') {
        return of(element[tcol.property]);
      } else {
        return of(element[tcol.property].toString());
      }
    }
  }

  getTableCellType(tcol: TableColumn<T, any>, editing: boolean): TableColumnDisplayType {
    if (tcol.button) {
      return 'button';
    }
    if (this.isEditingColumn(tcol, editing)) {
      return 'form';
    }
    if (tcol.directEdit && tcol.formField) { // not differentiating editFormField and addFormField because direct edit is always in edit mode
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
    const baseValue = tcol.ngStyle ? tcol.ngStyle(element[tcol.property], element, this.dataList) : {};
    baseValue['textAlign'] = this.utilService.getTextAlign(tcol.align);
    if (tcol.heightFn) {
      const height = tcol.heightFn(element[tcol.property], element, this.dataList);
      if (height) {
        baseValue['height'] = height.toString();
      }
    } else {
      baseValue['minHeight'] = this.minHeight + 'px';
    }
    return baseValue;
  }

  onMouseEnter($event: MouseEvent) {
    if (this.tableColumn.onMouseEnter) {
      this.tableColumn.onMouseEnter(this.element[this.tableColumn.property], this.element, this.dataList, $event);
    }
  }

  onMouseLeave($event: MouseEvent) {
    if (this.tableColumn.onMouseLeave) {
      this.tableColumn.onMouseLeave(this.element[this.tableColumn.property], this.element, this.dataList, $event);
    }
  }
}

type TableColumnDisplayType = 'text' | 'button' | 'directEdit' | 'form' | 'component';
