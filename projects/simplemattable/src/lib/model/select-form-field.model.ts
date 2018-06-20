import {AbstractFormField} from './abstract-form-field.model';
import {FormFieldType} from './form-field-type.model';
import {SelectFormFieldOption} from './select-form-field-option.model';

export class SelectFormField<T, P extends keyof T, F> extends AbstractFormField<T, P, F> {

  options: SelectFormFieldOption<F>[] = [];

  constructor() {
    super();
    this.formType = FormFieldType.SELECT;
  }

  /**
   * Can be used to specify the options for this select input.
   * @param options SelectFormFieldOption[]
   * @returns this
   */
  withOptions(options: SelectFormFieldOption<F>[]): this {
    this.options = options;
    return this;
  }
}
