import {Component, Input, OnInit} from '@angular/core';
import {TableColumn} from '../model/table-column.model';
import {Align} from '../model/align.model';
import {UtilService} from '../util.service';

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
  cellAlign: string = '';
  stringRepresentation: string = '';

  constructor(private utilService: UtilService) {
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
      this.cellAlign = this.utilService.getCellAlign(this.tableColumn.align);
      const data = this.elements.map(element => element[this.tableColumn.property]);
      this.stringRepresentation = this.tableColumn.footer(data, this.elements);
    }
  }

  getCellCssStyle(tcol: TableColumn<T, any>, elements: T[]): Object {
    const elementValues: any = elements.map(element => element[tcol.property]);
    const baseValue = tcol.footerNgStyle ? tcol.footerNgStyle(elementValues, elements) : {};
    baseValue['textAlign'] = this.getTextAlign(tcol.align);
    return baseValue;
  }

  getCellCssClass(tcol: TableColumn<T, any>, elements: T[]): Object {
    const defaultClass = {'filler-div': true};
    let ngClass = null;
    if (tcol.footerNgClass) {
      const elementValues: any = elements.map(element => element[tcol.property]);
      ngClass = tcol.footerNgClass(elementValues, elements);
    }
    return this.utilService.getCellCssClass(tcol, ngClass, defaultClass);
  }

  private getTextAlign = (align: Align): string => align === Align.LEFT ? 'start' : align === Align.CENTER ? 'center' : 'end';

}
