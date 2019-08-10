import { Component, OnInit } from '@angular/core';
import { ComplexTestData, TestData } from '../model/test-data.model';
import { TableColumn } from 'projects/simplemattable/src/public_api';

@Component({
  selector: 'smc-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css']
})
export class FormsComponent implements OnInit {

  // Form
  dataForm: ComplexTestData[] = [];
  columnsForm: TableColumn<any, any>[] = [];
  id = 42;

  constructor() { }

  ngOnInit() {
    const d1 = new Date();
    d1.setDate(20);
    d1.setMonth(1);
    d1.setFullYear(2018);
    const d2 = new Date();
    d2.setDate(15);
    d2.setMonth(7);
    d2.setFullYear(2017);
    /*
      Form Table
    */
    this.dataForm = [
      new ComplexTestData(1, 40, 'test1', new TestData('Key1', 'Value1', d1), 'test2'),
      new ComplexTestData(2, 42, 'test2', new TestData('Key2', 'Value2', d2), 'test3')
    ];
    const formIdCol = new TableColumn<ComplexTestData, 'id'>('My ID', 'id');
    const formValueCol = new TableColumn<ComplexTestData, 'value'>('My Value', 'value');
    formValueCol.withFormField(formValueCol.getNumberFormField());
    const formDataValCol = new TableColumn<ComplexTestData, 'data'>('Nested Value', 'data')
      .withTransform(data => data.value);
    formDataValCol.withFormField(formDataValCol.getTextFormField()
      .withFocus(true)
      .withInit(data => data.value)
      .withApply((val, data) => {
        data.value = val;
        return data;
      }));
    this.columnsForm = [
      formIdCol, formValueCol, formDataValCol
    ];
  }

  createFn(): ComplexTestData {
    return new ComplexTestData(0, 42, '', new TestData('', '', new Date()), '');
  }

  formAdd(element: ComplexTestData) {
    setTimeout(() => {
      element.id = this.id++;
      this.dataForm.push(element);
      this.dataForm = this.dataForm.slice(0);
    }, 2000);
  }

  formDelete(element: ComplexTestData) {
    setTimeout(() => {
      const index = this.dataForm.indexOf(element);
      if (index >= 0) {
        this.dataForm.splice(index, 1);
        this.dataForm = this.dataForm.slice(0);
      }
    }, 2000);
  }

  formEdit(element: ComplexTestData) {
    setTimeout(() => {
      this.dataForm[this.dataForm.findIndex(ele => ele.id === element.id)] = element;
      this.dataForm = this.dataForm.slice(0);
    }, 2000);
  }

  logDataForm() {
    console.log(this.dataForm);
  }

}
