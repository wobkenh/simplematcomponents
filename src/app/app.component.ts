import {Component, OnInit} from '@angular/core';
import {TableColumn} from '../../projects/simplemattable/src/lib/model/table-column.model';
import {AlertType} from '../../projects/simplealert/src/simplealert/alert-type.model';
import {Align} from '../../projects/simplemattable/src/lib/model/align.model';
import {ButtonType} from '../../projects/simplemattable/src/lib/model/button-type.model';
import {Width} from '../../projects/simplemattable/src/lib/model/width.model';
import {AbstractControl, Validators} from '@angular/forms';
import {Height} from '../../projects/simplemattable/src/lib/model/height.model';

@Component({
  selector: 'smc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  testData: ComplexTestData[];
  columns: TableColumn<any, any>[] = [];
  columns2: TableColumn<any, any>[] = [];
  isInfoOpen = true;
  isErrorOpen = true;
  isWarnOpen = true;
  isSuccessOpen = true;
  alertType = AlertType;
  id = 42;

  // Simple Table
  dataSimple: ComplexTestData[] = [];
  columnsSimple: TableColumn<any, any>[] = [];

  // Transform Table
  dataTransform: ComplexTestData[] = [];
  columnsTransform: TableColumn<any, any>[] = [];

  // Width Table
  dataWidth: ComplexTestData[] = [];
  columnsWidth: TableColumn<any, any>[] = [];

  // Align Table
  dataAlign: ComplexTestData[] = [];
  columnsAlign: TableColumn<any, any>[] = [];

  // Sortable Table
  dataSortable: ComplexTestData[] = [];
  columnsSortable: TableColumn<any, any>[] = [];

  // Visibility Table
  dataVisibility: ComplexTestData[] = [];
  columnsVisibility: TableColumn<any, any>[] = [];

  // Icons and Buttons Table
  dataIconsButtons: ComplexTestData[] = [];
  columnsIconsButtons: TableColumn<any, any>[] = [];
  linkClickCountIconsButtons = 0;
  linkLastClickedIconsButtons = 0;
  btnClickCountIconsButtons = 0;
  btnLastClickedIconsButtons = 0;

  // Multiline
  dataMultiline: ComplexTestData[] = [];
  columnsMultiline: TableColumn<any, any>[] = [];

  // CustomCss
  dataCustomCss: ComplexTestData[] = [];
  columnsCustomCss: TableColumn<any, any>[] = [];

  // Filter
  dataFilter: ComplexTestData[] = [];
  columnsFilter: TableColumn<any, any>[] = [];

  // Form
  dataForm: ComplexTestData[] = [];
  columnsForm: TableColumn<any, any>[] = [];

  // Scrollable
  dataScrollable: ComplexTestData[] = [];
  columnsScrollable: TableColumn<any, any>[] = [];

  // Complete
  dataComplete: ComplexTestData[] = [];
  columnsComplete: TableColumn<any, any>[] = [];

  ngOnInit(): void {
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
        Simple Table
     */
    this.dataSimple = [
      new ComplexTestData(1, 40, 'test1', null, 'test2'),
      new ComplexTestData(2, 42, 'test2', null, 'test3')
    ];
    this.columnsSimple = [
      new TableColumn<ComplexTestData, 'id'>('My ID', 'id'),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value')
    ];

    /*
      Transform Table
    */
    this.dataTransform = [
      new ComplexTestData(1, 40, 'test1', new TestData('Key1', 'Value1', d1), 'test2'),
      new ComplexTestData(2, 42, 'test2', new TestData('Key2', 'Value2', d2), 'test3')
    ];
    this.columnsTransform = [
      new TableColumn<ComplexTestData, 'id'>('My ID', 'id'),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value'),
      new TableColumn<ComplexTestData, 'value'>('My Value * 2', 'value')
        .withTransform((data) => (data * 2).toString()),
      new TableColumn<ComplexTestData, 'data'>('Nested Value', 'data')
        .withTransform((data) => data.value)
    ];

    /*
      Width Table
    */
    this.dataWidth = [
      new ComplexTestData(1, 40, 'test1', null, 'test2'),
      new ComplexTestData(2, 42, 'test2', null, 'test3')
    ];
    this.columnsWidth = [
      new TableColumn<ComplexTestData, 'id'>('My ID', 'id')
        .withWidth(Width.px(100)),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value')
        .withWidth(Width.pct(50)),
      new TableColumn<ComplexTestData, 'description'>('My Description', 'description')
    ];

    /*
      Align Table
    */
    this.dataAlign = [
      new ComplexTestData(1, 40, 'test1', null, 'test2'),
      new ComplexTestData(2, 42, 'test2', null, 'test3')
    ];
    this.columnsAlign = [
      new TableColumn<ComplexTestData, 'id'>('My ID - Left Align (Default)', 'id')
        .withWidth(Width.pct(33)),
      new TableColumn<ComplexTestData, 'value'>('My Value - Center Align', 'value')
        .withWidth(Width.pct(33))
        .withAlign(Align.CENTER),
      new TableColumn<ComplexTestData, 'description'>('My Description - Right Align', 'description')
        .withWidth(Width.pct(33))
        .withAlign(Align.RIGHT),
    ];

    /*
      Sortable Table
    */
    this.dataSortable = [
      new ComplexTestData(1, 40, 'test1', new TestData('Key1', 'Value1', d1), 'test2'),
      new ComplexTestData(2, 42, 'test2', new TestData('Key2', 'Value2', d2), 'test3')
    ];
    this.columnsSortable = [
      new TableColumn<ComplexTestData, 'id'>('My ID', 'id'),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value'),
      new TableColumn<ComplexTestData, 'value'>('My Value - Sorted in Reverse', 'value')
        .withSortTransform((data) => data * -1),
      new TableColumn<ComplexTestData, 'data'>('Nested Value', 'data')
        .withTransform((data) => data.value)
        .withSortTransform((data) => data.value)
    ];

    /*
      Visibility Table
    */
    this.dataVisibility = [
      new ComplexTestData(1, 40, 'test1', new TestData('Key1', 'Value1', d1), 'test2'),
      new ComplexTestData(2, 42, 'test2', new TestData('Key2', 'Value2', d2), 'test3')
    ];
    this.columnsVisibility = [
      new TableColumn<ComplexTestData, 'id'>('My ID - Hidden Text on xs/sm', 'id')
        .isTextHiddenSm(true),
      new TableColumn<ComplexTestData, 'value'>('My Value - Hidden Column on xs/sm', 'value')
        .isHiddenSm(true),
      new TableColumn<ComplexTestData, 'description'>('My Description - Manual Toggle', 'description'),
    ];

    /*
      Icons and Buttons Table
    */
    this.dataIconsButtons = [
      new ComplexTestData(1, 40, 'test1', new TestData('Key1', 'Value1', d1), 'test2'),
      new ComplexTestData(2, 42, 'test2', new TestData('Key2', 'Value2', d2), 'test3')
    ];
    this.columnsIconsButtons = [
      new TableColumn<ComplexTestData, 'id'>('My ID - Link', 'id')
        .withOnClick(id => {
          this.linkLastClickedIconsButtons = id;
          this.linkClickCountIconsButtons++;
        }),
      new TableColumn<ComplexTestData, 'value'>('My Value - Raised Button', 'value')
        .withButton(ButtonType.RAISED)
        .withOnClick(id => {
          this.btnLastClickedIconsButtons = id;
          this.btnClickCountIconsButtons++;
        }),
      new TableColumn<ComplexTestData, 'description'>('My Description - Icon', 'description')
        .withIcon((description) => description === 'test1' ? 'delete' : 'wifi'),
    ];


    /*
      Multiline Table
    */
    this.dataMultiline = [
      new ComplexTestData(1, 40, 'Lorem ipsum dolor sit amet, consetetur sadipscing ' +
        'elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam ' +
        'voluptua.', null, 'test2'),
      new ComplexTestData(2, 42, 'Text\nWith\nMultiline\nJust\nLook\nAt\nMe!!!', null, 'test3'),
      new ComplexTestData(3, 43, 'Regular Text!!!', null, 'test3')
    ];
    this.columnsMultiline = [
      new TableColumn<ComplexTestData, 'id'>('My ID - Link', 'id')
        .withWidth(Width.px(100)),
      new TableColumn<ComplexTestData, 'description'>('My Description - span', 'description')
        .withWidth(Width.px(300)),
      new TableColumn<ComplexTestData, 'description'>('My Description - textarea', 'description')
        .withMaxLines(20),
    ];


    /*
      CustomCss Table
    */
    this.dataCustomCss = [
      new ComplexTestData(1, 40, 'description 1', null, 'test2'),
      new ComplexTestData(2, 42, 'description 2', null, 'test3'),
      new ComplexTestData(3, 43, 'description 3', null, 'test3')
    ];
    this.columnsCustomCss = [
      new TableColumn<ComplexTestData, 'id'>('My ID - Color depends on id', 'id')
        .withNgStyle((id) => ({'background-color': 'rgb(0, ' + id * 50 + ', 0)'})),
      new TableColumn<ComplexTestData, 'description'>('My Description with background image (ngStyle)', 'description')
        .withNgStyle(() => ({'background-image': 'url(assets/smile.png)'})),
      new TableColumn<ComplexTestData, 'description'>('My Description with background color (ngClass)', 'description')
        .withNgClass(() => 'red-bg-cell')
    ];

    /*
      Filter Table
    */
    this.dataFilter = [
      new ComplexTestData(1, 40, 'search for me test1', new TestData('Key1', 'Value1', d1), 'test2'),
      new ComplexTestData(2, 42, 'or for me test2', new TestData('Key2', 'Value2', d2), 'test3')
    ];
    this.columnsFilter = [
      new TableColumn<ComplexTestData, 'id'>('My ID', 'id'),
      new TableColumn<ComplexTestData, 'description'>('My Description with column filter', 'description')
        .withColFilter(),
      new TableColumn<ComplexTestData, 'data'>('Nested Value with column filter', 'data')
        .withTransform(data => data.value)
        .withColFilter(),
    ];

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
      .withInit(data => data.value)
      .withApply((val, data) => {
        data.value = val;
        return data;
      }));
    this.columnsForm = [
      formIdCol, formValueCol, formDataValCol
    ];

    /*
      Scrollable Table
    */
    this.dataScrollable = [
      new ComplexTestData(1, 40, 'description 1', null, 'test2'),
      new ComplexTestData(2, 42, 'description 2', null, 'test3'),
      new ComplexTestData(3, 43, 'description 3', null, 'test3'),
      new ComplexTestData(4, 44, 'description 4', null, 'test4'),
      new ComplexTestData(5, 45, 'description 5', null, 'test5'),
      new ComplexTestData(6, 46, 'description 6', null, 'test6'),
      new ComplexTestData(7, 47, 'description 7', null, 'test7'),
      new ComplexTestData(8, 48, 'description 8', null, 'test8'),
      new ComplexTestData(9, 49, 'description 9', null, 'test9'),
      new ComplexTestData(10, 50, 'description 10', null, 'test10'),
      new ComplexTestData(11, 51, 'description 11', null, 'test11'),
      new ComplexTestData(12, 52, 'description 12', null, 'test12'),
      new ComplexTestData(13, 53, 'description 13', null, 'test13'),
      new ComplexTestData(14, 54, 'description 14', null, 'test14')
    ];

    this.columnsScrollable = [
      new TableColumn<ComplexTestData, 'id'>('My ID', 'id'),
      new TableColumn<ComplexTestData, 'value'>('My Value', 'value'),
      new TableColumn<ComplexTestData, 'description'>('My Description', 'description')
    ];


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
    const completeValueCol = new TableColumn<ComplexTestData, 'value'>('Number with select', 'value')
      .withColFilter()
      .withAlign(Align.CENTER);

    completeValueCol.withFormField(completeValueCol.getSelectFormField<number>()
      .withOptions([
        {display: '39', value: 39},
        {display: '40', value: 40},
        {display: '41', value: 41},
        {display: 'eine lustige Zahl', value: 420}
      ])
      .withValidators([Validators.required, Validators.min(25)])
      .withErrors([
        {key: 'required', msg: 'Value is required!'},
        {key: 'min', msg: 'Value should be at least 25!'}
      ]));
    const completeTestErrorCol = new TableColumn<ComplexTestData, 'data'>('Nested Value Select', 'data')
      .withTransform(data => data.value)
      .withAlign(Align.CENTER);
    completeTestErrorCol.withFormField(completeTestErrorCol.getSelectFormField<string>()
      .withOptions([
        {display: 'Manatee', value: 'Manatee'},
        {display: 'Dog', value: 'Dog'},
        {display: 'Natalie Dormer', value: 'Natalie Dormer'},
        {display: 'A Muffin', value: 'A Hotdog'},
      ]).withPlaceholder('Sexiest Thing alive'));
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
      .withHint('Only past dates.')
      .withPlaceholder('Date')
      .withErrors([
        {key: 'required', msg: 'Date is required!'},
        {key: 'pastDate', msg: 'Date needs to be in the past!'}
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
    this.columnsComplete = [completeIdCol, completeTestErrorCol, completeDesCol, completeDes2Col, completeValueCol, completeKeyCol, completeValCol, completeDateCol, completeMultilineCol];
  }

  pastDateValidator = (control: AbstractControl) => control.value < new Date() ? null : {'pastDate': true};

  getDateStr = (date: Date) => (date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()) + '.' +
    (date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '.' + date.getFullYear();

  openInfo() {
    this.isInfoOpen = true;
  }

  openError() {
    this.isErrorOpen = true;
  }

  openWarn() {
    this.isWarnOpen = true;
  }

  openSuccess() {
    this.isSuccessOpen = true;
  }

  onDelete(element: ComplexTestData) {
    setTimeout(() => {
      const index = this.testData.indexOf(element);
      if (index >= 0) {
        this.testData.splice(index, 1);
        this.testData = this.testData.slice(0);
      }
    }, 2000);
  }

  onEdit(element: ComplexTestData) {
    setTimeout(() => {
      this.testData[this.testData.findIndex(ele => ele.id === element.id)] = element;
      console.log('edit');
      console.log(element);
      this.testData = this.testData.slice(0);
    }, 2000);
  }

  onAdd(element: ComplexTestData) {
    setTimeout(() => {
      element.id = this.id++;
      this.testData.push(element);
      console.log('add');
      console.log(element);
      this.testData = this.testData.slice(0);
    }, 2000);
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

}

class TestData {
  constructor(public key: string, public value: string, public date: Date) {
  }
}

class ComplexTestData {
  constructor(public id: number, public value: number, public description: string, public data: TestData, public notes: string) {
  }
}
