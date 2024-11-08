import {AbstractFormField} from './abstract-form-field.model';
import {FormFieldType} from './form-field-type.model';
import {DateFilterFn} from '@angular/material/datepicker';

export class DateFormField<T, P extends keyof T> extends AbstractFormField<T, P, Date> {

  dateFilterFn: DateFilterFn<any>;

  constructor() {
    super();
    this.formType = FormFieldType.DATE;
  }

  withDateFilterFn(dateFilterFn: DateFilterFn<any>): this {
    this.dateFilterFn = dateFilterFn;
    return this;
  }
}
