import {AbstractFormField} from './abstract-form-field.model';
import {FormFieldType} from './form-field-type.model';

export class TextFormField<T, P extends keyof T> extends AbstractFormField<T, P, string> {
  constructor() {
    super();
    this.formType = FormFieldType.TEXT;
  }
}
