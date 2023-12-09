import { Component, Input, OnInit } from '@angular/core';
import { TableColumn } from '../model/table-column.model';
import { Align } from '../model/align.model';
import { SmcUtilService } from '../smc-util.service';
import { isObservable, Observable, of, Subscription } from 'rxjs';

@Component({
  selector: 'smc-footer-cell',
  templateUrl: './footer-cell.component.html',
  styleUrls: ['./footer-cell.component.css']
})
export class FooterCellComponent<T> implements OnInit {

  tableColumn: TableColumn<T, any>;
  elements: T[];
  cellCssStyle: Object = {};
  cellCssClass: Object = {};
  stringRepresentation: string | number = '';
  transformSubscription: Subscription;

  constructor(private utilService: SmcUtilService) {
  }

  ngOnInit(): void {
  }

  @Input()
  set tableColumnInput(tableColumn: TableColumn<T, any>) {
    this.tableColumn = tableColumn;
    this.updateTableColumnAndData();
  }

  @Input()
  set dataParent(parents: T[]) {
    this.elements = parents;
    this.updateTableColumnAndData();
  }

  private updateTableColumnAndData() {
    // All updates that require table column AND data
    if (this.tableColumn && this.elements) {
      this.cellCssClass = this.getCellCssClass(this.tableColumn, this.elements);
      this.cellCssStyle = this.getCellCssStyle(this.tableColumn, this.elements);
      this.cellCssStyle['justifyContent'] = this.utilService.getCellAlign(this.tableColumn.align);
      const data = this.elements.map(element => element[this.tableColumn.property]);
      if (this.transformSubscription) {
        this.transformSubscription.unsubscribe();
      }
      this.transformSubscription = this.getStringRepresentation(this.tableColumn, data, this.elements).subscribe(stringRepresentation => {
        this.stringRepresentation = stringRepresentation;
      });
    }
  }

  private getStringRepresentation(tcol: TableColumn<T, any>, data: any[], parents: T[]): Observable<string | number> {
    const transformed = tcol.footer(data, parents);
    if (isObservable(transformed)) {
      return transformed;
    } else {
      return of(transformed);
    }
  }

  getCellCssStyle(tcol: TableColumn<T, any>, elements: T[]): Object {
    const elementValues: any = elements.map(element => element[tcol.property]);
    const baseValue = tcol.footerNgStyle ? tcol.footerNgStyle(elementValues, elements) : {};
    baseValue['textAlign'] = this.getTextAlign(tcol.align);
    return baseValue;
  }

  getCellCssClass(tcol: TableColumn<T, any>, elements: T[]): Object {
    const defaultClass = { };
    let ngClass = null;
    if (tcol.footerNgClass) {
      const elementValues: any = elements.map(element => element[tcol.property]);
      ngClass = tcol.footerNgClass(elementValues, elements);
    }
    return this.utilService.getCellCssClass(tcol, ngClass, defaultClass);
  }

  private getTextAlign = (align: Align): string => align === Align.LEFT ? 'start' : align === Align.CENTER ? 'center' : 'end';

}
