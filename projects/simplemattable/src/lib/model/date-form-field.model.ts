import {AbstractFormField} from './abstract-form-field.model';
import {FormFieldType} from './form-field-type.model';

export class DateFormField<T, P extends keyof T> extends AbstractFormField<T, P, Date> {
  constructor() {
    super();
    this.formType = FormFieldType.DATE;
  }
}
