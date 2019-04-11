import {AbstractFormField} from './abstract-form-field.model';
import {FormFieldType} from './form-field-type.model';

export class CheckboxFormField<T, P extends keyof T> extends AbstractFormField<T, P, boolean> {
  constructor() {
    super();
    this.formType = FormFieldType.CHECKBOX;
  }
}
