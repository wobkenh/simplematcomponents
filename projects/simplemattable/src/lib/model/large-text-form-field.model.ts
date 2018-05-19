import {AbstractFormField} from './abstract-form-field.model';
import {FormFieldType} from './form-field-type.model';

export class LargeTextFormField<T, P extends keyof T> extends AbstractFormField<T, P, string> {

  maxLines: number = 10;
  minLines: number = 1;

  constructor() {
    super();
    this.formType = FormFieldType.LARGE_TEXT;
  }

  /**
   * Max lines of the textarea formfield.
   * Defaults to 10.
   * @param maxLines
   * @returns this
   */
  withMaxLines(maxLines: number) {
    this.maxLines = maxLines;
    return this;
  }

  /**
   * Minimum number of lines of the textarea formfield.
   * Defaults to 1.
   * @param minLines
   * @returns this
   */
  withMinLines(minLines: number) {
    this.minLines = minLines;
    return this;
  }
}
