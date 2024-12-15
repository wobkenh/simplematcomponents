import { Component, OnInit } from '@angular/core';
import { ComplexTestData, TestData } from '../model/test-data.model';
import { Align, ButtonType, Height, TableColumn, Width } from 'projects/simplemattable/src/public_api';
import { AbstractControl, Validators } from '@angular/forms';

@Component({
  selector: 'smc-complete',
  templateUrl: './complete.component.html',
  styleUrls: ['./complete.component.css'],
  standalone: false
})
export class CompleteComponent implements OnInit {

  // Complete
  dataComplete: ComplexTestData[] = [];
  columnsComplete: TableColumn<any, any>[] = [];
  private id = 42;

  constructor() {
  }

  ngOnInit() {
    const d1 = new Date();
    d1.setDate(20);
    d1.setMonth(1);
    d1.setFullYear(2018);
    const d2 = new Date();
    d2.setDate(15);
    d2.setMonth(7);
    d2.setFullYear(2017);
    const d3 = new Date();
    d3.setDate(4);
    d3.setMonth(3);
    d3.setFullYear(2017);
    /*
      Complete Table
    */

    this.dataComplete = [
      new ComplexTestData(1, 40, 'test1', new TestData('Key1', 'Value1', d1), 'test1'),
      new ComplexTestData(2, 41, '', new TestData('Key2', 'Value2', d2), ''),
      new ComplexTestData(3, 39, 'test3', new TestData('Key3', 'Value3', d3), 'test3'),
      new ComplexTestData(4, 39, 'test3', new TestData('Key3', 'Value3', d3), 'test3'),
      new ComplexTestData(5, 39, 'test3', new TestData('Key3', 'Value3', d3), 'test3'),
      new ComplexTestData(6, 39, 'test3', new TestData('Key3', 'Value3', d3), 'test3'),
      new ComplexTestData(7, 39, 'test3', new TestData('Key3', 'Value3', d3), 'test3'),
      new ComplexTestData(8, 40, 'test1', new TestData('Key1', 'Value1', d1), 'test1'),
      new ComplexTestData(9, 41, '', new TestData('Key2', 'Value2', d2), ''),
      new ComplexTestData(10, 39, 'test3', new TestData('Key3', 'Value3', d3), 'test3'),
      new ComplexTestData(11, 39, 'test3', new TestData('Key3', 'Value3', d3), 'test3'),
      new ComplexTestData(12, 39, 'test3', new TestData('Key3', 'Value3', d3), 'test3'),
      new ComplexTestData(13, 39, 'test3', new TestData('Key3', 'Value3', d3), 'test3'),
      new ComplexTestData(14, 39, 'test3', new TestData('Key3', 'Value3', d3), 'test3')
    ];

    const completeIdCol = new TableColumn<ComplexTestData, 'id'>('ID with button', 'id')
      .withIcon((id) => id < 3 ? 'add' : 'delete')
      .withButton(ButtonType.RAISED)
      .withButtonColor('primary')
      .withWidth(Width.px(125))
      // .withHeightFn(() => Height.px(100))
      .isTextHiddenXs(true);
    const completeDesCol = new TableColumn<ComplexTestData, 'description'>('Description', 'description')
      .withColFilter()
      .withTransform(() => '')
      .withHeightFn(() => Height.px(150))
      .withWidth(Width.px(150))
      .withNgStyle(() => {
        return {
          'background': 'url(assets/smile.png)',
          'background-size': 'contain',
          'background-repeat': 'repeat',
          // 'height': '150px'
        };
      })
      .isHiddenSm(true);
    completeDesCol.withFormField(completeDesCol
      .getCheckboxFormField()
      .withInit((des) => des !== 'false')
      .withApply((bool) => bool ? 'very true' : 'false'));
    const completeValueCol = new TableColumn<ComplexTestData, 'value'>('Number with select', 'value')
      .withColFilter()
      .withAlign(Align.CENTER);

    completeValueCol.withFormField(completeValueCol.getSelectFormField<number>()
      .withOptions([
        { display: '39', value: 39 },
        { display: '40', value: 40 },
        { display: '41', value: 41 },
        { display: 'eine lustige Zahl', value: 420 }
      ])
      .withValidators([Validators.required, Validators.min(25)])
      .withErrors([
        { key: 'required', msg: 'Value is required!' },
        { key: 'min', msg: 'Value should be at least 25!' }
      ]));
    const completeTestErrorCol = new TableColumn<ComplexTestData, 'data'>('Nested Value Select', 'data')
      .withTransform(data => data.value)
      .withAlign(Align.CENTER);
    completeTestErrorCol.withFormField(completeTestErrorCol.getSelectFormField<string>()
      .withOptions([
        { display: 'Manatee', value: 'Manatee' },
        { display: 'Dog', value: 'Dog' },
        { display: 'Natalie Dormer', value: 'Natalie Dormer' },
        { display: 'A Muffin', value: 'A Hotdog' },
      ]).withPlaceholder('Sexiest Thing alive')
      .withInit(data => data.value)
      .withApply((value, data) => {
        data.value = value;
        return data;
      }));
    const completeDes2Col = new TableColumn<ComplexTestData, 'description'>('Description2', 'description')
      .isVisible(false)
      .withAlign(Align.LEFT)
      .withMinLines(3)
      .withMaxLines(3)
      .withOnClick((data) => console.log(data));
    completeDes2Col.withFormField(completeDes2Col.getLargeTextFormField().withHint('Hier steht ein langer Text'));
    const completeKeyCol = new TableColumn<ComplexTestData, 'data'>('Key', 'data')
      .withTransform((data) => data.key)
      .isHiddenSm(true)
      .withOnClick((data) => console.log(data));
    completeKeyCol.withFormField(completeKeyCol.getTextFormField()
      .withFocus(true)
      .withInit((data) => data.key)
      .withApply((id, data) => {
        data.key = id;
        return data;
      }))
      .withAlign(Align.RIGHT);
    const completeValCol = new TableColumn<ComplexTestData, 'data'>('Value with icon', 'data')
      .isHiddenXs(true)
      .withNgClass(() => 'red-bg-cell')
      .withIcon(() => 'menu')
      .withColFilter()
      .withTransform((data) => data.value);
    const completeDateCol = new TableColumn<ComplexTestData, 'data'>('Date right Align', 'data')
      .withTransform((data) => this.getDateStr(data.date))
      .withSortTransform(data => data.date.toISOString())
      .withAlign(Align.RIGHT)
      .withColFilter();
    completeDateCol.withFormField(completeDateCol.getDateFormField()
      .withDateFilterFn((date: Date) => {
        if (!date) {
          return false;
        }
        if (date.getDate() === 15) {
          return false;
        }
        if (date.getTime() > new Date().getTime()) {
          return false;
        }
        return true;
      })
      .withHint('Only past dates and not the 15th.')
      .withPlaceholder('Date')
      .withErrors([
        { key: 'required', msg: 'Date is required!' },
        { key: 'pastDate', msg: 'Date needs to be in the past!' }
      ])
      .withValidators([Validators.required, this.pastDateValidator])
      .withInit(data => data.date)
      .withApply((val, data) => {
        data.date = val;
        return data;
      })
    );
    const completeMultilineCol = new TableColumn<ComplexTestData, 'notes'>('This header will take multiple lines to display the header', 'notes')
      .withColFilter();
    this.columnsComplete = [
      completeIdCol, completeTestErrorCol, completeDesCol, completeDes2Col, completeValueCol,
      completeKeyCol, completeValCol, completeDateCol, completeMultilineCol
    ];

  }

  onDelete(element: ComplexTestData) {
    setTimeout(() => {
      const index = this.dataComplete.indexOf(element);
      if (index >= 0) {
        this.dataComplete.splice(index, 1);
        this.dataComplete = this.dataComplete.slice(0);
      }
    }, 2000);
  }

  onEdit(element: ComplexTestData) {
    setTimeout(() => {
      this.dataComplete[this.dataComplete.findIndex(ele => ele.id === element.id)] = element;
      console.log('edit');
      console.log(element);
      this.dataComplete = this.dataComplete.slice(0);
    }, 2000);
  }

  onAdd(element: ComplexTestData) {
    setTimeout(() => {
      element.id = this.id++;
      this.dataComplete.push(element);
      console.log('add');
      console.log(element);
      this.dataComplete = this.dataComplete.slice(0);
    }, 2000);
  }

  pastDateValidator = (control: AbstractControl) => control.value < new Date() ? null : { 'pastDate': true };

  getDateStr = (date: Date) => (date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()) + '.' +
    (date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '.' + date.getFullYear();

  createFn(): ComplexTestData {
    return new ComplexTestData(0, 42, '', new TestData('', '', new Date()), '');
  }
}
