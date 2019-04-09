# simplemattable

SimpleMatTable is an abstraction of MatTable from the @angular/material dependency. 
It allows you to quickly and in a typesafe way define tables. 
This is perfect if you want to display data in a table and do not need full control over the table HTML.

Instead of copy/pasting the HTML for each column, you can describe the columns in a declarative way via Typescript code.
A lot of different options like align, buttons, icons and even custom css allow you to further customize your table.

SimpleMatTable also allows you to enable adding, editing and deleting of elements in the table. 
It supports different form fields like number, text, date and select inputs.

Current test coverage (Statements/Branches/Functions/Lines): ~94%/~87%/~93%/~94%

## Attention

To all users of simplemattable 1.X: Due to issues concerning the row height when using material components (e.g. `<mat-table>`),
simplemattable was now (Version 2.X) changed to use the material directives (e.g. `<table mat-table>`). 
This solution allows for full control over the table css and eliminates the problems regarding component isolation.

So what changed for you? Column widths might now be different since they will be calculated according to the standard html table functionality.
If you used the width property on columns, you can no longer enter a flex string or specify shrink/grow.
Instead, you can now only supply widths that can be parsed by the width css property (preferably via the width-object).   

## Table of contents

- [Prerequisites](#prerequisites)
- [Preview](#preview)
- [Installing](#installing)
- [Usage](#usage)
    + [Model](#model)
    + [TableColumns](#tablecolumns)
    + [Table](#table)
    + [Complex model](#complex-model)
    + [Dynamic updates](#dynamic-updates)
    + [TableColumn options](#tablecolumn-options)
    + [Edit-Mode](#edit-mode)
- [Contributing](#contributing)
- [Change History](#change-history)
- [Upcoming features](#upcoming-features)
- [Dependencies](#dependencies)
- [Authors](#authors)
- [License](#license)

## Prerequisites

Simplemattable is for use with Angular Material Design only. As of the first version, 
it requires Angular Material 6.0. Later Versions require Angular Material 7.0 or above. Also make sure to add @angular/flex-layout to your list of dependencies.

For a detailed list of neccessary dependencies, see [section Dependencies](#dependencies).

## Preview

[Demo](https://simplex24.de/smc-demo "Demo")


## Installing

Start with a normal Angular App with Material Design installed.

Then install Simplemattable using

```
npm install simplemattable
```

Then import the SimplemattableModule into your AppModule. The following snippet shows the minimum AppModule you need to use Simplemattable:

```
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {SimplemattableModule} from 'simplemattable';
import {AppComponent} from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SimplemattableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## Usage

### Model

Lets say you have a model that you want to display in a table, for example:

```
class TestData {
  constructor(public key: string, public value: string) {
  }
}
```

### TableColumns

In your component (e.g. AppComponent) you can then define your columns like this:

```
columns = [
  new TableColumn<TestData, 'key'>('Key', 'key'),
  new TableColumn<TestData, 'value'>('Value', 'value')
];
```

The TableColumn class requires two generics. The first is the class of your model, the second is the property this column describes. 
The property-generic uses "keyof T", so your IDE will show an error at compile time if you enter a name that does not belong to a property of your model.

The Constructor of TableColumn requires you to specify the string that will be displayed in the table header and (again) the name of the property on the model. 
You already specified the property name in the generics, but since information about generics is not available at runtime, you need to specify it here again. 
Fortunately, the property in the constructor is also typesafe.

If you are looking for more customization options (e.g. align, width, different display values) for your columns, have a look at section [TableColumn options](#tablecolumn-options).

### Table

After you defined your table columns, you can bind them to the html element using:

```
<smc-simplemattable [data]="testData" [columns]="columns" [paginator]="true" [filter]="true" [sorting]="true"></smc-simplemattable>
```

where testData is an array of your model and columns are the TableColumns you defined earlier.

Additionally, you can turn on a paginator, a filter and sorting. These are the standard MatTable Features that are also well described in
[the Angular docs](https://material.angular.io/components/table/overview).
The paginator, filter and sorting are optional. If omitted, the flags will default to false.
The paginater can further be customized by the optional input parameter `[paginatorPageSize]`, which takes a number and sets the initial entries per page count. 
Also, via `[paginatorPageSizeOptions]`, which takes a number array, you can change the pagesize options that will be selectable in the paginator.

You can make the header of the table sticky using the `[sticky]` flag. The sticky header is turned off by default.  

If you want to enable adding/editing/deleting of elements in the table, have a look at [the section about edit-mode](#edit-mode-addeditdelete).

### Complex Model

If you have a more complex model, for example

```
class ComplexTestData {
  constructor(public id: number, public description: string, public data: TestData) {
  }
}
```

and you want to display the description property as well as key and value of the data property, you can specify the colums like this:

```
columns = [
  new TableColumn<ComplexTestData, 'description'>('Description', 'description'),
  new TableColumn<ComplexTestData, 'data'>('Key', 'data').withTransform((data) => data.key),
  new TableColumn<ComplexTestData, 'data'>('Value', 'data').withTransform((data) => data.value)
];
```

For more information about .withTransform and other optional column settings, see section [TableColumn options](#tablecolumn-options).

### Dynamic updates

Due to the data binding, the data as well as the table column definitions can be updated dynamically.

To update the table columns, simply change/add/remove the table columns in your table column array. 
For example, if you want to toggle the visiblility of the first column:

```
this.columns[0].isVisible(!this.columns[0].visible);
```

Simplemattable will recognize any changes to the properties of any of the supplied columns or to the column array.

Changing the data is a bit different. Performing the checks to recognize any changes on the fly would take up too much performance on large tables with complex models. 
Therefore, the default Angular check is used, which compares the array references via ===. This means that you have to change the array reference. 
If you have a table with the complex model described earlier, you could add a new entry using this:

```
this.testData.push(new ComplexTestData(42, 'New Entry', new TestData('key', 'value')));
this.testData = this.testData.slice(0);
```

Note that .slice(0) is one of the fastest, if not the fastest way to clone arrays. 
For more information, see [this StackOverflow question](https://stackoverflow.com/questions/3978492/javascript-fastest-way-to-duplicate-an-array-slice-vs-for-loop).

If sorting is enabled, updating the columns will clear the current sorting selection.
Changes in Data will not clear the sorting selection.

### TableColumn Options

TableColumn has several optional parameters, allowing you to further customize the table. 
Some of these properties are functions. 
These functions always take the property of your model (e.g. the key property of TestData) as first parameter and the model object itself (e.g the instance of TestData) as second parameter. 
Often times, the first parameter will suffice, so you can leave out the second one. 
Use the second one only if you need to reference another property of your model object in the function.

All options are accessible using a 'is'- or 'with'-function that allows you to chain the method calls. Also, you can set the properties of the table column directly. 

- transform (`.withTransform(transformFn: (data: T[P], dataParent: T) => string)`): Transform is a function that returns a string representation that will be displayed for this cell. 
This is helpful if e.g. your model contains a Date but you do not want the standard JS string representation of date to show, but rather your preferred format. 
- width (`.withWidth(width: (number | Width | string))`): The width of the column. Can bei either string, number or Width:
  + Width (recommended): Width allows you to enter the width in a typesafe way. 
  You can use `Width.px(pixel: number)` to get a pixel based width or `Width.pct(percent: number)` for percent based width. 
  + string: Valid width-string that is accepted by the width css-property.
  + number: Number of pixels.

  The width of the columns will be calculated like in any other html table. Attention: This differs from Version 1.X of simplemattable where flex-layout was used instead.
  
- height (`.withHeight(heightFn: (data: T[P], dataParent: T) => Height)`): By default, the height of a row will be calculated by the table cell contents in regular html table fashion. 
If you want to change the height (e.g. you want to display an image via css background property and the cell content is not large enough), supply the height function to calculate the height for each row.
The height function returns a Height object, which works just like the width object (see width option above).    

- align (`.withAlign(align: Align)`): Sets the text align within the column. Header and Cell content will both be aligned. Default is left align.

- sortable (`.isSortable(sortable: boolean)`): If sorting is enabled, you can disable sorting for certain columns by setting this property to false (default: true)

- sortTransform (`.withSortTransform(transformFn: (data: T[P], dataParent: T) => number | string)`): If you need custom sorting, you can specify sortTransform, 
which is a function that returns a number or string representation that is used to sort the table. 
Sorting will use the following representation of a column:
  1. If sortTransform is available, it will apply the data to the supplied function
  2. If the property is of type Date, it will use .toISOString(). This will not work with nested objects. The date has to be a property of your model class.
  3. If the property is of type object and transform is available, it will apply the data to the supplied function
  4. If earlier checks failed, it will use the property value
  
- visible (`.isVisible(visible: boolean)`): Can be used to change the visibility of a column

- icon (`.withIcon(iconNameFn: (data: T[P], dataParent: T) => string)`): Icon is a function that returns the name of the icon that will be prepended to the text in the table cell. 
Google Material Icons will be used, so you can [check out the icons here](https://material.io/tools/icons/). 
If you want to only display the icon with no text, specify the transform property with a function that always returns an empty string. 
Since icon is a function, you can decide for every row which icon you want to use, for example if you have a boolean property called 
`checkedIn` on your model, you could do  `(checkedIn) => checkedIn ? 'check' : 'close'` for its column, which will either display a tick or a cross icon.

- onClick (`.withOnClick(onClickFn: (data: T[P], dataParent: T) => void)`): OnClick enables the click listener for the table column.
If any cell (excluding the header cell) is clicked, the function onClick will be executed.
On hover, the background of clickable cells will turn into a half-transparent gray and the cursor will become a pointer.
This can be used for example if you have an overview table and want to display details on click. 
To make it easier for the user to understand that a cell is clickable, it is recommended that you add an appropriate icon.
If the button property is set, onClick does not change the hover background color, but rather acts as a click listener for the button.

- button (`.withButton(buttonType: ButtonType)`): Can be either `ButtonType.BASIC` (mat-button), `ButtonType.RAISED` (mat-raised-button) or `ButtonType.ICON` (mat-icon-button).
The button will use the text and icon (or only the icon in case of `ButtonType.ICON`) that would normally be displayed directly in the cell. 
If specified, the onClick function will be executed on a click event.

- buttonColor (`.withButtonColor(buttonColor: ThemePalette)`): If the button type is set, buttonColor allows you to change the button color. Can be either `'primary'`, `'warn'` or `'accent'`.
If you leave the button color empty, the standard white/transparent background (depending on button type) will be used.

- maxLines (`.withMaxLines(maxLineLength: number)`): Maximum lines of text in a cell. Note that this refers to the maximum number of lines in the cell. 
If the text is longer, a scrollbar will appear, but the cell will not grow any larger.
If not specified, a span will be used that ignores linebreaks in the text and spans over as many lines as needed.
If maxLines is specified, a textarea with the stated amount of maximum lines will be used. The textarea is able to display linebreaks appropriately.

- minLines (`.withMinLines(minLineLength: number)`): Minimum lines of text in a cell. Defaults to 1. 
Works only if maxLines is also specified as maxLines activates the textarea feature.

- responsive options: There are some predefined options for responsive design available. Of course, you can also dynamically change the columns by simply changing your column array.
The inbuilt options are:
    + columnHiddenXs (`.isColumnHiddenXs(columnHiddenXs: boolean)`): Default is false. Use true if you want to hide the column on very small screens.
    + columnHiddenSm (`.isColumnHiddenSm(columnHiddenSm: boolean)`): Default is false. Use true if you want to hide the column on very small and small screens.
    + textHiddenXs (`.isTextHiddenXs(textHiddenXs: boolean)`): Default is false. Use true if you want to hide the text of the cell/button on very small screens.
    + textHiddenSm (`.isTextHiddenSm(textHiddenSm: boolean)`): Default is false. Use true if you want to hide the text of the cell/button on very small and small screens.
    
- ngClass: (`.withNgClass(ngClassFn: (data: T[P], dataParent: T) => string | string[] | Object)`):
If you want to apply a custom css class to the table cells of a column, you can add the ngClass function.
It must return something that is parsable by the ngClass directive. For more information on ngClass [see the Angular docs](https://angular.io/api/common/NgClass).
CSS classes of your component's css can not be applied due to Angulars component style isolation. Instead, define the css in your global stylesheet.
On certain attributes, you will have to use the !important flag for the change to take effect. 
This happens on attributes that are already set in Simplemattable's own css. 
Currently, these attributes are `background-color` and `cursor`, which are set on clickable cells without buttons. 
If you need to style the children in the table cell, you can select them using the standard css features.
Note that the classes will be applied to a `<div>` that fills the `<td>` element completely and not to the `<td>` itself.

- ngStyle: (`.withNgStyle(ngStyleFn: (data: T[P], dataParent: T) => Object)`): 
If you want to apply custom inline css to the table cells of a column, you can add the ngStyle function.
It must return something that is parsable by the ngStyle directive. For more information on ngStyle [see the Angular docs](https://angular.io/api/common/NgStyle).
You do not need to use !important on ngStyle. For example, you could change the background color depending on id like this even when the column is clickable: 
`.withNgStyle((id) => ({'background-color': id < 3 ? '#992222' : 'transparent'}))`.
Note that the styles will be applied to a `<div>` that fills the `<td>` element completely and not to the `<td>` itself.

- colFilter: (`.withColFilter()`): When activated, displays a column filter input below the header cell of the column. 
The column filter works just like the filter feature of the table, but only filters rows using the values of the column. 
To set the text of a column filter programmatically, call the method `setColFilterText(text: string)` on the table column.
If you have problems with the width of the filter input, have a look at the info in the Edit-mode chapter below.

- colFilterText `setColFilterText(text: string)`: Allows you to programmatically set the text of the col filter. 
ColFilter (see above) needs to be active.

### Edit-mode

Edit-mode is a major feature of SimpleMatTable. It allows you to enable the add/edit/delete functionality.
I will explain this feature using the ComplexTestData example from [the complex model section](#complex-model).

INFO: If you have problems with form fields staying at 180px,
try overriding the width property of the css class `.mat-form-field-infix` in your global style. This means putting the following code into your global style.css:
```
smc-simplemattable .mat-form-field-infix {
  width: 100%!important;
}
``` 
`.mat-form-field-infix` is a css class provided and used by Angular Material Design and not by simplemattable, 
so it is your choice whether or not to touch it. 

#### Enabling form fields for a column

By default, columns will be readonly. So even if you turn on edit/add, 
the user won't be able to change the data of the column. 
To add a form field to the column, use the `.withFormField(formField: AbstractFormField<T, P, any>)` function.
The form field argument requires an AbstractFormField. This can be:

- TextFormField: Input for normal text without linebreaks. Will result in an `<input>`.
- NumberFormField: Input for numbers. Will result in an `<input type="number">`.
- LargeTextFormField: Input for large texts with linebreaks. Will result in a `<textarea>`.
- SelectFormField: Input for a list of options the user can chose from. Will result in a `<mat-select>`.
- DateFormField: Input for dates. Will result in a `<input matDatepicker>`.

The AbstractFormField requires some Type parameters. You already supplied those in your TableColumn object, so 
to make things easier, the TableColumn has the following methods for creating FormFields:

- `getTextFormField()`
- `getNumberFormField()`
- `getLargeTextFormField()`
- `getSelectFormField<F>()` (more info on the type paremter later)
- `getDateFormField()`

this means you can add a form field for the description of our ComplexTestData like this:
```
const descCol = new TableColumn<ComplexTestData, 'description'>('Description', 'description');
descCol.withFormField(valueCol.getTextFormField())
```

SimpleMatTable support hints, placeholders, validators and errors on form fields.
Also, for complex models, you can supply additional init and apply functions 
that transform the value of the object before it is inserted into the form field 
or when it gets saved from the form field to the object instance.
All those can be specified using the `.with` methods of the form field. 
Placeholder and hints are implemented using [Angular Material form fields](https://material.angular.io/components/form-field/overview).
Validators are implemented using [Angular reactive forms](https://angular.io/guide/reactive-forms). 

Here a short overview of how to use the options:

- placeholder (`withPlaceholder(placeholder: string)`): A string displayed on the form field to indicate what the user is supposed to enter.
- hint (`withHint(hint: string)`): A string displayed on the form field to give the user a hint.
- validators (`withValidators(validators: (ValidatorFn[] | ValidatorFn))`): One or several validator functions. 
May be inbuilt functions like Validators.required or Validators.min or selfdefined functions.
An element can not be saved until all validator functions pass.
- errors (`withErrors(errors: FormError[])`): The error messages that can be displayed on the form fields. 
`FormError` is an interface that has two strings: `key` and `msg`. 
Key is the error name that any validator you specified might add to the errors of the form control (e.g: 'required' when using Validators.required). 
Msg is the message that will be displayed if the given key is found in the errors of the form control.
- init (`withInit(initFn: (data: T[P], dataParent: T) => F)`): If you specify this function, it will be executed
when the form field is created (e.g. when the user hits the edit button on a row). 
The function should transform the property of your model that this column describes into whatever the form field needs.
Depending on the form field you chose, this could be for example string (text/large text input) or number (number input).
This means that you could use e.g. a date form field even though the property on your model is not a date, as long as you use withInit  and withApply to transform the value.
- apply (`withApply(applyFn: (value: F, data: T[P], dataParent: T) => void)`) : If you specify this function, it will be executed when the user saves a row.
The funtion should transform the value from the form field (e.g. Date if you use a date input) 
in a way that it can be set as the property of your model. 
If omitted, the value is applied directly. 
You should only omit this function if the property datatype equals the form field data type.
- focus (`withFocus(focus: boolean)`): Default is false. If set to true, the input of this form field will be focused when the user clicks add or edit.

An example demonstrating all of the above (I added the property `date: Date` to `TestData`):

```
const dateCol = new TableColumn<ComplexTestData, 'data'>('Date', 'data')
  .withTransform((data) => this.getDateStr(data.date))
  .withSortTransform(data => data.date.toISOString())
dateCol.withFormField(dateCol.getDateFormField()
  .withFocus(true)
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
```

with the pastDateValidator looking like this:

```
pastDateValidator = (control: AbstractControl) => control.value < new Date() ? null : {'pastDate': true};
```

Note that if `date` was a property of `ComplexTestData` and not `TestData`, 
you could omit `.withInit` and `.withApply` because the property is a Date and the date form field requires a Date.

As i already stated earlier, select inputs are a bit special. Let's look at an example (I added the number property `value` to `ComplexTestData`):

```
const valueCol = new TableColumn<ComplexTestData, 'value'>('Value', 'value');
valueCol.withFormField(valueCol.getSelectFormField<number>()
  .withOptions([
    {display: '39', value: 39},
    {display: '40', value: 40},
    {display: '41', value: 41},
    {display: 'the answer to life, the universe and everything', value: 42},
  ]));
```

The select form field requires you to specify some options. The options must fulfill the interface SelectFormFieldOption.
It has a display string value, which will be displayed in the mat-select and a value of type F. Type F is, as you can see in the example, 
supplied when calling getSelectFormField. 
If you need a mapping between the values in the options and the property of your model (e.g. when working with nested Objects), use `.withInit` and `.withApply`.

#### Addition of Elements

To enable the user to add new elements to the table, set the `addable` Input parameter to true. 
Then, write a function that returns a new instance of your model class (signature: `() => T`) and bind the function to the input parameter `create`.
The create function will be called to generate a new default object that will be added to the table.

When the user saves a newly added element, an event will fire. 
You can listen to this event by binding to the output parameter `add`. 
The event data will be a deep copy of the added element. 
When the event fires, the row with the new element goes into loading state and a small progress spinner appears in the last cell of the row.
The data does not refresh until you refresh it manually, so you can first talk to your backend and save the data before confirming the new 
element by adding it to your data array.

Here a small example of how this could look like (using RxJS Observables):

```
onAdd(element: ComplexTestData) {
  myDataService.insertComplexTestData(element).subscribe((complexData) => {
    this.testData.push(complexData);
    this.testData = this.testData.slice(0); // Shallow copy to trigger update
  }, error => {
    // Do sth about the error, e.g. Error above/below the table or an error dialog
  });
}
```

#### Editing of Elements

To enable the user to edit elements in the table, set the `editable` Input parameter to true. 
Make sure that you have all form fields of fields you want the user to edit and (if necessary) their init/apply methods up and running.

When the user saves an edited element, an event will fire. 
You can listen to this event by binding to the output parameter `edit`. 
The event data will be a deep copy of the edited element. 
When the event fires, the row with the edited element goes into loading state and a small progress spinner appears in the last cell of the row.
The data does not refresh until you refresh it manually, so you can first talk to your backend and save the data before confirming the changes 
by removing the old element and replacing it with the new element.

Here a small example of how this could look like (using RxJS Observables):

```
onEdit(element: ComplexTestData) {
  myDataService.updateComplexTestData(element).subscribe((complexData) => {
    this.testData[this.testData.findIndex(ele => ele.id === complexData.id)] = complexData;
    this.testData = this.testData.slice(0); // Shallow copy to trigger update
  }, error => {
   // Do sth about the error, e.g. Error above/below the table or an error dialog
  });
}
```

#### Deleting of Elements

To enable the user to delete elements in the table, set the `deletable` Input parameter to true. 

When the user deletes an element, an event will fire. 
You can listen to this event by binding to the output parameter `delete`. 
The event data will be the element to delete. 
When the event fires, the row with the deleted element goes into loading state and a small progress spinner appears in the last cell of the row.
The data does not refresh until you refresh it manually, so you can first talk to your backend and delete the element before 
confirming the deletion by removing the element.

Here a small example of how this could look like (using RxJS Observables):

```
onDelete(element: ComplexTestData) {
  myDataService.updateComplexTestData(element).subscribe(() => {
    const index = this.testData.indexOf(element);
    if (index >= 0) {
      this.testData.splice(index, 1);
      this.testData = this.testData.slice(0);  // Shallow copy to trigger update
    }
  }, error => {
   // Do sth about the error, e.g. Error above/below the table or an error dialog
  });
}
```

#### Icons

The icons for add, save, delete, edit and cancel are all configurable. 
You can change them by specifying the respective simplemattable input paramters 
`addIcon`, `saveIcon`, `deleteIcon`, `editIcon` and `cancelIcon`. 
You need to specify them as a valid Material Icon string. [You can check out all supported icons here.](https://material.io/tools/icons/)

    
## Contributing

The Sourcecode is in a public github repository. You may contribute by opening pull requests
if you have any nice ideas for improvements, new features, bugfixes, unittests, ...

If there are any problems or if you have any questions, feel free to contact me.
You can find my email address in the [authors section](#authors).


## Change History

There will be new versions when new features are added or a new Angular version releases.

History (Version in parenthesis is required Angular Version):
+ 2.0 (7.0): Switched from mat-table components to mat-table directives, thus switching to table layout; 
fixed some smaller bugs regarding adding of items, filtering and focus
+ 1.6 (7.0): Multiline header cells
+ 1.5 (7.0): Filter for Columns
+ 1.4 (7.0): Updated to Angular 7
+ 1.3 (6.1): Sticky header option, Angular Version updated to 6.1 (6.4 @angular/material)
+ 1.2 (6.0): Customizable icons and initial focus for input fields
+ 1.1 (6.0): Use enter to save on text/number input fields
+ 1.0 (6.0): Edit-mode in all its glory: edit/add/delete with text/largetext/number/date/select inputs
+ 0.12 (6.0): max/min lines, option to hide text/columns on small screens, ngClass and ngStyle
+ 0.11 (6.0): Width rework + TableColumn constructor refactor
+ 0.10 (6.0): Buttons
+ 0.9 (6.0): Click listener support
+ 0.8 (6.0): Icon support, added the row data object as second parameter to all TableColumn function properties
+ 0.7 (6.0): Hidden columns and better listening mechanism for data change detection
+ 0.6 (6.0): Sort Transform Function for custom sorting
+ 0.5 (6.0): Allow for multiple columns to use the same property
+ 0.4 (6.0): Removed outer div, now using V6.0 of Angular fxFlex (@angular/flex-layout)
+ 0.3 (6.0): Sorting
+ 0.2 (6.0): Filtering using display values instead of object property values
+ 0.1 (6.0): Alignment
+ 0.0 (6.0): First Version


## Upcoming Features
+ Currently, there are no more (major) features planned. If someone has some nice ideas, feel free 
to contribute ([see section Contributing](#contributing)).
+ This library will be updated on every major Angular version following Angular 6. 
It is not planned to backport SimpleMatTable to any older Angular version.
+ There might be bugfixes or error handling improvements in the future or new unit tests to raise the test coverage.

## Dependencies

Simplemattable only uses peer dependencies, so for the newest version of simplemattable you need the following packages (with compatible versions) in your package.json:

```
"@angular/common": "^7.0.0",
"@angular/core": "^7.0.0",
"@angular/material": "^7.0.0",
"@angular/cdk": "^7.0.0",
"@angular/platform-browser": "^7.0.0",
"@angular/flex-layout": "^7.0.0-beta.19"
```  

+ For use with Angular >= 6.0 and < 6.1.8, use Version 1.2 of simplemattable.
+ For use with Angular >= 6.1.8 and < 7.0, use Version 1.3 of simplemattable.

## Authors

Henning Wobken (henning.wobken@simplex24.de)

## License

This project is licensed under the MIT License
