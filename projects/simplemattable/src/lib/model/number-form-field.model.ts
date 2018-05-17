import {AbstractFormField} from './form-field.model';
import {FormFieldType} from './form-field-type.model';

export class NumberFormField<T, P extends keyof T> extends AbstractFormField<T, P, number> {
  constructor() {
    super();
    this.formType = FormFieldType.NUMBER;
  }
}
