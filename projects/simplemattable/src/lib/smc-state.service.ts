import {Injectable} from '@angular/core';
import {TableColumn} from './model/table-column.model';

@Injectable({
  providedIn: 'root'
})
export class SmcStateService<T> {


  /**
   * Holds the current string values for the table cells
   * Can be used to filter on the current table cell values, even if they were loaded async
   */
  stringRepresentationMap = new Map<T, Map<TableColumn<any, any>, string | number>>();
  expandedElement: T | null;
  /**
   * When using expandable rows, we dont want to render all detail components at once
   * So we remove the detail component when not expanded
   * problem: the closing animation takes some time and we dont want the detail component to suddenly disappear before the animation is finished
   * solution: not only display the currently open detail component, but also the one opened before that
   */
  lastExpandedElement: T | null;

  constructor() {
  }

  putStringRepresentation(element: T, tcol: TableColumn<any, any>, stringRepresentation: string | number) {
    if (!this.stringRepresentationMap.has(element)) {
      this.stringRepresentationMap.set(element, new Map());
    }
    // keyof T cannot be used to index an object, but we know keyof T is always a string:
    this.stringRepresentationMap.get(element).set(tcol, stringRepresentation);
  }

  getStringRepresentation(tcol: TableColumn<T, any>, element: T, data: T[]): string | number {
    const stringRepresentationObject = this.stringRepresentationMap.get(element);
    if (stringRepresentationObject && stringRepresentationObject.get(tcol)) {
      return stringRepresentationObject.get(tcol);
    }
    if (tcol.transform) {
      // Sadly, we cant use observables here as the datasource's filter function (for which this is used)
      // does not support returning observables
      return tcol.transform(element[tcol.property], element, data) + '';
    } else if (element[tcol.property] === null || element[tcol.property] === undefined) {
      return '';
    } else {
      const value = element[tcol.property];
      if (typeof value === 'number') {
        return value;
      } else {
        return value.toString();
      }
    }
  }


  setExpandedElement(row: T) {
    this.lastExpandedElement = this.expandedElement;
    if (this.expandedElement === row) {
      this.expandedElement = null;
    } else {
      this.expandedElement = row;
    }
  }
}
