import {Injectable} from '@angular/core';
import {TableColumn} from './model/table-column.model';
import {Align} from './model/align.model';

@Injectable({
  providedIn: 'root'
})
export class SmcUtilService {

  constructor() {
  }

  /**
   * Uses the TableColumn ngClass property to create the ngStyle Object for a table cell.
   * May also include some internal css classes.
   *
   * @param tcol TableColumn
   * @param ngClass class result from any ngClass function of TableColumn or null
   * @param defaultClass default class that always will be applied
   * @returns ngClass Object
   */
  getCellCssClass<T>(tcol: TableColumn<T, any>, ngClass: string | string[] | Object | null, defaultClass: Object): Object {
    if (!ngClass) {
      return defaultClass;
    }
    if (typeof ngClass === 'string') {
      return Object.assign(defaultClass, this.arrayToObject(ngClass.split(' ')));
    } else if (Array.isArray(ngClass)) {
      return Object.assign(defaultClass, this.arrayToObject(ngClass));
    } else {
      return Object.assign(defaultClass, ngClass);
    }
  }

  arrayToObject(arr: string[]): Object { // turn ['css-class-a', 'css-class-b'] into {'css-class-a': true, 'css-class-b': true}
    return arr.reduce((acc, entry) => {
      acc[entry] = true;
      return acc;
    }, {});
  }

  getTextAlign = (align: Align): string => align === Align.LEFT ? 'start' : align === Align.CENTER ? 'center' : 'end';

  getCellAlign = (align: Align): string => align === Align.LEFT ? 'start center' : align === Align.CENTER ? 'center center' : 'end center';
}
