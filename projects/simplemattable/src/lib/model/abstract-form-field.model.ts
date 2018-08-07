import {FormFieldType} from './form-field-type.model';
import {ValidatorFn} from '@angular/forms';
import {FormError} from './form-error.model';

export class AbstractFormField<T, P extends keyof T, F> {
  formType: FormFieldType;
  validators: ValidatorFn[] = [];
  init: (data: T[P], dataParent: T) => F;
  apply: (value: F, data: T[P], dataParent: T) => T[P];
  errors: FormError[] = [];
  placeholder: string = '';
  focus: boolean = false;
  hint: string = '';

  /**
   * Validator functions that can be applied to a form control.
   * For more information see angular docs on reactive forms validation.
   *
   * @param validators
   * @returns this
   */
  withValidators(validators: (ValidatorFn[] | ValidatorFn)): this {
    if (Array.isArray(validators)) {
      this.validators = validators;
    } else {
      this.validators = [validators];
    }
    return this;
  }


  /**
   * The init function takes the current value of the object (your model) and the object and converts it
   * to a value that can be inserted into the form field.
   *
   * @param initFn
   * @returns this
   */
  withInit(initFn: (data: T[P], dataParent: T) => F): this {
    this.init = initFn;
    return this;
  }

  /**
   * The apply function takes the new value, the old value and the object containing the old data.
   * It applies the new value to the object and saves it.
   * Can be used if you need a conversion between the input value and the property value of your model.
   *
   * @param applyFn
   * @returns this
   */
  withApply(applyFn: (value: F, data: T[P], dataParent: T) => T[P]): this {
    this.apply = applyFn;
    return this;
  }

  /**
   * Error messages for this form field. Keys should be the error flags that the validators will set.
   * Messages will be the error messages displayed below the form control.
   *
   * @param errors FormError
   * @returns this
   */
  withErrors(errors: FormError[]): this {
    this.errors = errors;
    return this;
  }

  /**
   * Placeholdertext that will be displayed either in the form field if the form field is empty or above it if it is not empty.
   * @param placeholder
   * @returns this
   */
  withPlaceholder(placeholder: string): this {
    this.placeholder = placeholder;
    return this;
  }

  /**
   * Text that will be displayed below the form field if there is no error message present.
   * @param hint
   * @returns this
   */
  withHint(hint: string): this {
    this.hint = hint;
    return this;
  }

  /**
   * true = input will be focused when the user selects add or edit. Default is false.
   * @param focus
   * @returns this
   */
  withFocus(focus: boolean): this {
    this.focus = focus;
    return this;
  }

}
