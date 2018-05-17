import {FormFieldType} from './form-field-type.model';
import {ValidatorFn} from '@angular/forms';

export class AbstractFormField<T, P extends keyof T, F> {
  formType: FormFieldType;
  validators: ValidatorFn[] = [];
  init: (data: T[P], dataParent: T) => F;
  apply: (value: F, data: T[P], dataParent: T) => void;

  /**
   * Validator functions that can be applied to a form control.
   * For more information see angular docs on reactive forms validation.
   *
   * @param validators
   * @returns this
   */
  withValidators(validators: (ValidatorFn[] | ValidatorFn)) {
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
  withInit(initFn: (data: T[P], dataParent: T) => F) {
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
  withApply(applyFn: (value: F, data: T[P], dataParent: T) => void) {
    this.apply = applyFn;
    return this;
  }

}
