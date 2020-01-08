import {Component, OnInit} from '@angular/core';
import {TableColumn} from 'simplemattable';

@Component({
  selector: 'smc-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.css']
})
export class PlaygroundComponent implements OnInit {

  columns: TableColumn<ViewModel, any>[] = [];
  viewData: ViewModel[] = [];

  constructor() {
  }

  ngOnInit() {
    for (let i = 0; i < 20; i++) {
      this.columns.push(this.getTableColumn());
    }
    this.columns = this.columns.slice(0);
    for (let i = 0; i < 20; i++) {
      this.viewData.push({test: 'test' + i});
    }
    this.viewData = this.viewData.slice(0);
  }

  private getTableColumn(): TableColumn<ViewModel, any> {
    const aktivColumn = new TableColumn<ViewModel, 'test'>('Test', 'test');
    aktivColumn.withIcon(data => data ? 'check_box' : 'check_box_outline_blank');
    aktivColumn.withTransform(data => '');
    const aktivColumnInput = aktivColumn.getTextFormField();
    aktivColumn.withFormField(aktivColumnInput);
    return aktivColumn;
  }


  createFn(): ViewModel {
    return {
      test: ''
    };
  }

  formAdd(element: ViewModel) {
    setTimeout(() => {
      this.viewData.push(element);
      this.viewData = this.viewData.slice(0);
    }, 2000);
  }

  formDelete(element: ViewModel) {
    setTimeout(() => {
      const index = this.viewData.indexOf(element);
      if (index >= 0) {
        this.viewData.splice(index, 1);
        this.viewData = this.viewData.slice(0);
      }
    }, 2000);
  }

  formEdit(element: ViewModel) {
    setTimeout(() => {
      this.viewData[this.viewData.findIndex(ele => ele === element)] = element;
      this.viewData = this.viewData.slice(0);
    }, 2000);
  }
}

export interface ViewModel {
  test: string;
}
