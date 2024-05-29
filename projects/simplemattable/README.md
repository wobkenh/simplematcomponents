# simplemattable

SimpleMatTable is an abstraction of MatTable from the @angular/material dependency.
It allows you to quickly and in a typesafe way define tables.
This is perfect if you want to display data in a table and do not need full control over the table HTML.

Instead of copy/pasting the HTML for each column, you can describe the columns in a declarative way via Typescript code.
A lot of different options like align, buttons, icons, custom css and even custom table cell components allow you to further customize your table.

SimpleMatTable also allows you to enable adding, editing and deleting of elements in the table.
It supports different form fields like number, text, date and select inputs.

## Table of contents

- [Prerequisites](#prerequisites)
- [Preview](#preview)
- [Installing](#installing)
- [Quickstart](#quickstart)
- [Usage](#usage)
  + [Model](#model)
  + [TableColumns](#tablecolumns)
  + [Table (+ table options)](#table)
  + [Complex model](#complex-model)
  + [Dynamic updates](#dynamic-updates)
  + [TableColumn options](#tablecolumn-options)
  + [Edit-Mode](#edit-mode)
  + [Pagination](#pagination)
  + [Infinite Scrolling](#infinite-scrolling)
  + [Progress spinner](#progress-spinner)
  + [Custom Filter](#custom-filter)
- [Contributing](#contributing)
- [Change History](#change-history)
- [Upcoming features](#upcoming-features)
- [Dependencies](#dependencies)
- [Authors](#authors)
- [License](#license)

## Prerequisites

Simplemattable is for use with Angular Material Design only. As of the first version,
it requires at least Angular Material 6.0. Some features are only available in versions which require a higher Angular version. Using the latest Angular version means you can make use of the newest version of simplemattable.

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

## Quickstart

After having installed simplemattable, lets go through the steps of defining a very basic table.

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

### Table

After you defined your table columns, you can bind them to the html element using:

```
<smc-simplemattable [data]="testData" [columns]="columns"></smc-simplemattable>
```

where testData is an array of your model and columns are the TableColumns you defined earlier.

Thats it. Your table should now display. Now you can have a look at all the options simplemattable offers.

## Cheat Sheet

You want a quick overview of all simplemattable options? You forgot what an option was called or what it does?
You can easily get the most important information from the javadoc of simplemattable.
Simply have a look at the Input/Output parameters of the SimpleMatTable class and the `.with` methods of the TableColumn class.

## Usage

We have already defined a basic table in [Quickstart](#quickstart). Now its time to take a deeper dive into some of the options simplemattable offers.

### Table

There are several options concerning the whole table. Those are defined as input and output parameter of the Simplemattable component.

#### Pagination, Filtering, Sorting

You can turn on a paginator, a filter and sorting. These are the standard MatTable Features that are also well described in
[the Angular docs](https://material.angular.io/components/table/overview).
The paginator, filter and sorting are optional. If omitted, the flags will default to false.

If you want to caputure changes in sorting, you can use the `(sort)` output event from simplemattable.

The paginater can further be customized by the optional input parameter `[paginatorPageSize]`, which takes a number and sets the initial entries per page count.
Also, via `[paginatorPageSizeOptions]`, which takes a number array, you can change the pagesize options that will be selectable in the paginator.
For more information on the paginator feature, have a look at the [paginator section](#pagination)

If instead of pagination, you want lazy loading via scrolling, you can use the infiniteScrolling options. For more information regarding infinite scrolling, have a look at the [infinite scrolling section](#infinite-scrolling)

#### Sticky

You can make the header of the table sticky using the `[sticky]` flag. The sticky header is turned off by default.  
If you want to stick the button column to the end of the table, use the `stickyButtons` option.

#### Column Reordering / Drag and Drop

To enable the user to reorder the columns by dragging and dropping the table headers, set the `columnDragAndDrop` flag of simplemattable to true.
Default ist false.

#### Column Reordering / Drag and Drop

To enable the user to reorder the rows by dragging and dropping the table rows, set the `rowDragAndDrop` flag of simplemattable to true.
Default ist false.

The reordering of the data is not done by simplemattable. Instead, listen to the output parameter `rowDrop` and use
e.g. `moveItemInArray` on your data using the indices of the event to change the order.

#### Editing

If you want to enable adding/editing/deleting of elements in the table, have a look at [the section about edit-mode](#edit-mode).

#### Accessing the data

If you want to know which elements are currently displayed in your table, use the `renderedData` output parameter.
If you want to know which elements apply to the current filter, use the `filteredData` output parameter.

#### Row clicks

If you want to be informed when the user clicks on a row, listen to the `rowClick` output event.
If you also want to make the table rows to appear clickable via a hover effect and pointer cursor, set the input parameter `rowClickable` to true.

#### Row customization

You can apply row-specific styles using the `rowNgStyle` and `rowNgClass` attributes.
Both are methods which get the data of the row (your model) as parameter.

`rowNgStyle: (data: T, dataList: T[]) => Object` lets you return an object that will be fed into the `ngStyle` attribute of the table row (`<tr>`).

`rowNgClass: (data: T, dataList: T[]) => string | string[] | Object` lets you return a string, string array or object that will be fed into the `ngClass` attribute of the row (`<tr>`).
Note that when using `rowNgClass`, the row must be in the global stylesheet due to component isolation.

If you have a footer row, you may define footer-specific styles in `footerRowNgStyle: (data: T[]) => Object` and `rowNgClass: (data: T[]) => string | string[] | Object`.

#### Expandable Rows

Want to show the user some details when he clicks on a row?
Then define a component for your row detail content that implements the `DetailRowComponent` interface.
You can then pass the type to simplemattable's `detailRowComponent` input parameter.
The data (which element was clicked) will be passed into the Detail Component via the `onInput: (element: T, dataList: T[]) => void` method,
which is defined in the `DetailRowComponent` interface.

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
Therefore, the default Angular check is used, which compares the array references via `===`. This means that you have to change the array reference.
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
These functions always take the property of your model (e.g. the key property of TestData) as first parameter, the model object itself (e.g the instance of TestData) as second parameter
and the whole list of data as third parameter (e.g. List of TestData).
Often times, the first parameter will suffice, so you can leave out the second one.
Use the second one only if you need to reference another property of your model object in the function.

All options are accessible using a 'is'- or 'with'-function that allows you to chain the method calls. Also, you can set the properties of the table column directly.

- transform (`.withTransform(transformFn: (data: T[P], dataParent: T, dataList: T[]) => string | number | Observable<string, number>)`): Transform is a function that returns a string representation that will be displayed for this cell.
  This is helpful if e.g. your model contains a Date but you do not want the standard JS string representation of date to show, but rather your preferred format.
  Or you could load the string representation from a remote server by returning an observable obtained from an http request. Note that if an observable is supplied, the filter function wont work for this column.
- width (`.withWidth(width: (number | Width | string))`): The width of the column. Can bei either string, number or Width:
  + Width (recommended): Width allows you to enter the width in a typesafe way.
    You can use `Width.px(pixel: number)` to get a pixel based width or `Width.pct(percent: number)` for percent based width.
  + string: Valid width-string that is accepted by the width css-property.
  + number: Number of pixels.

  The width of the columns will be calculated like in any other html table. Attention: This differs from Version 1.X of simplemattable where flex-layout was used instead.

- height (`.withHeight(heightFn: (data: T[P], dataParent: T, dataList: T[]) => Height)`): By default, the height of a row will be calculated by the table cell contents in regular html table fashion.
  If you want to change the height (e.g. you want to display an image via css background property and the cell content is not large enough), supply the height function to calculate the height for each row.
  The height function returns a Height object, which works just like the width object (see width option above).

- align (`.withAlign(align: Align)`): Sets the text align within the column. Header and Cell content will both be aligned. Default is left align.

- sortable (`.isSortable(sortable: boolean)`): If sorting is enabled, you can disable sorting for certain columns by setting this property to false (default: true)

- sortTransform (`.withSortTransform(transformFn: (data: T[P], dataParent: T, dataList: T[]) => number | string)`): If you need custom sorting, you can specify sortTransform,
  which is a function that returns a number or string representation that is used to sort the table.
  Sorting will use the following representation of a column:
  1. If sortTransform is available, it will apply the data to the supplied function
  2. If the property is of type Date, it will use .toISOString(). This will not work with nested objects. The date has to be a property of your model class.
  3. If the property is of type object and transform is available, it will apply the data to the supplied function
  4. If earlier checks failed, it will use the property value

- visible (`.isVisible(visible: boolean)`): Can be used to change the visibility of a column

- icon (`.withIcon(iconNameFn: (data: T[P], dataParent: T, dataList: T[]) => string)`): Icon is a function that returns the name of the icon that will be prepended to the text in the table cell.
  Google Material Icons will be used, so you can [check out the icons here](https://material.io/tools/icons/).
  If you want to only display the icon with no text, specify the transform property with a function that always returns an empty string.
  Since icon is a function, you can decide for every row which icon you want to use, for example if you have a boolean property called
  `checkedIn` on your model, you could do  `(checkedIn) => checkedIn ? 'check' : 'close'` for its column, which will either display a tick or a cross icon.

- onClick (`.withOnClick(onClickFn: (data: T[P], dataParent: T, dataList: T[]) => void, event: MouseEvent)`): OnClick enables the click listener for the table column.
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

- buttonDisabled (`.withButtonDisabled(disabledFn: (data: T[P], dataParent: T, dataList: T[]) => boolean)`): If a button is present (see `withButton`),
  use this function to switch the button between active and disabled state.

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

- ngClass: (`.withNgClass(ngClassFn: (data: T[P], dataParent: T, dataList: T[]) => string | string[] | Object)`):
  If you want to apply a custom css class to the table cells of a column, you can add the ngClass function.
  It must return something that is parsable by the ngClass directive. For more information on ngClass [see the Angular docs](https://angular.io/api/common/NgClass).
  CSS classes of your component's css can not be applied due to Angulars component style isolation. Instead, define the css in your global stylesheet.
  On certain attributes, you will have to use the !important flag for the change to take effect.
  This happens on attributes that are already set in Simplemattable's own css.
  Currently, these attributes are `background-color` and `cursor`, which are set on clickable cells without buttons.
  If you need to style the children in the table cell, you can select them using the standard css features.
  Note that the classes will be applied to a `<div>` that fills the `<td>` element completely and not to the `<td>` itself.

- ngStyle: (`.withNgStyle(ngStyleFn: (data: T[P], dataParent: T, dataList: T[]) => Object)`):
  If you want to apply custom inline css to the table cells of a column, you can add the ngStyle function.
  It must return something that is parsable by the ngStyle directive. For more information on ngStyle [see the Angular docs](https://angular.io/api/common/NgStyle).
  You do not need to use !important on ngStyle. For example, you could change the background color depending on id like this even when the column is clickable:
  `.withNgStyle((id) => ({'background-color': id < 3 ? '#992222' : 'transparent'}))`.
  Note that the styles will be applied to a `<div>` that fills the `<td>` element completely and not to the `<td>` itself.

- footer (`.withFooter(footerFn: (data: T[P][], dataParent: T[]) => string)`):
  Same as withTransform, but determines the content of the footer cell of this component.
  If no table column has a footer function, no footer will be display. If at least one *visible* column has a footer function, the footer will be displayed.

- footerNgClass: (`.withFooterNgClass(footerNgClassFn: (data: T[P][], dataParents: T[]) => string | string[] | Object)`):
  Same as ngClass, but applies to the cell in the footer row corresponding to this table column.

- footerNgStyle: (`.withFooterNgStyle(footerNgStyleFn: (data: T[P], dataParent: T, dataList: T[]) => Object)`):
  Same as ngStyle, but applies to the cell in the footer row corresponding to this table column.

- colFilter: (`.withColFilter()`): When activated, displays a column filter input below the header cell of the column.
  The column filter works just like the filter feature of the table, but only filters rows using the values of the column.
  To set the text of a column filter programmatically, call the method `setColFilterText(text: string)` on the table column.
  If you have problems with the width of the filter input, have a look at the info in the Edit-mode chapter below.

- colFilterLabel: (`.withColFilterLabel(label: string)`): Sets the label displayed as placeholder in the column filter input.

- colFilterText `setColFilterText(text: string)`: Allows you to programmatically set the text of the col filter.
  ColFilter (see above) needs to be active.

- directEdit `isDirectEdit(directEdit: boolean)`:
  There are cases where you want your user to edit the data directly without having to press edit/save first.
  A usecase for this would be if you want to display a checkbox at the end of each row, which the user can use to
  select/deselect rows. If you encounter such a usecase, set directEdit on the last column to true using this method. A form field
  will be displayed, no matter if editing is enabled and the row is being edited.
  Don't forget to define the form field first (see [the edit mode section](#edit-mode)).
  Under the hood, direct edit uses ngModel while edit mode uses form controls.
  By default, direct edit is turned off.

- sticky `isSticky(sticky: boolean)`:
  If you have a wide table that is scrollable and want to make a column stick, use the sticky table column options.
  The sticky options sticks the column to the left of the table. It will start to stick once it has passed the left border of the table.

- stickyEnd `isStickyEnd(stickyEnd: boolean)`:
  The same as `sticky`, but the column will stick to the end of the table.
  The column will start sticking once it has passed the right border of the table.

- ngComponent `withNgComponent(ngComponent: Type<any>)`:
  If ngstyle/ngclass and string transformations are not enough, you can substitute the cell content with your own component.
  Use this method to supply the Component Type. Use the Component Name as the parameter (e.g. `MyCustomComponent`).
  Have a look at `withNgComponentInput` to feed the component with input.

- ngComponentInput `withNgComponentInput(ngComponentInput: (component: any, data: T[P], dataParent: T, dataList: T[]) => void)`:
  If you want to display your own angular component in the table cells and have activated this feature through `withNgComponent`,
  then you can supply a function here to fill the input parameters of your component. The function will be passed the component instance
  as well as the data / element the cell represents. Change detection is linked to the simplemattable change detection,
  so changes to the table column will be reflected instantly while changes to data will be reflected after the reference of your data array has changed.
  Note: to accomplish type safety, explicitly state the type of your Component when defining this function.
  The component instance is listed as "any" to avoid having to pass a third generic to the table column.

- searchFn `withSearch(searchFn: (searchInput: string) => void)`:
  Function that is called when the user enters a search query into the filter input.
  If you want to handle the search yourself, use withFilter instead.

- filterFn `withFilter(filterFn: (searchInput: string, data: T[P], dataParent: T) => boolean)`:
  Specify a custom filter function to overwrite the default behaviour of the column search input.
  If you only want to listen to search inputs of the user without changing the filter behaviour, use withSearch.
  The filterFn is a function checking if the given element matches the search string.
  It should return true if element matches and should be kept and should return false if the element does not match and should be removed.

### Edit-mode

Edit-mode is a major feature of SimpleMatTable. It allows you to enable the add/edit/delete functionality.
I will explain this feature using the ComplexTestData example from [the complex model section](#complex-model).

<details> 
  <summary>Klick here if you have problems with the form field size on older versions (<=14.0) of simplemattable</summary>
   INFO: If you have problems with form fields staying at 180px,
    try overriding the width property of the css class .mat-form-field-infix in your global style. This means putting the following code into your global style.css:
    <pre>
    smc-simplemattable .mat-form-field-infix {
      width: 100%!important;
    }
    </pre>
    .mat-form-field-infix is a css class provided and used by Angular Material Design and not by simplemattable, 
    so it is your choice whether or not to touch it.  
</details>

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
- CheckboxFormField: Input for boolean. Will result in a `<mat-checkbox>`.

The AbstractFormField requires some Type parameters. You already supplied those in your TableColumn object, so
to make things easier, the TableColumn has the following methods for creating FormFields:

- `getTextFormField()`
- `getNumberFormField()`
- `getLargeTextFormField()`
- `getSelectFormField<F>()` (more info on the type paremter later)
- `getDateFormField()`
- `getCheckboxFormField()`

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
- asyncValidators (`withAsyncValidators(asyncValidators: (AsyncValidatorFn[] | AsyncValidatorFn))`): One or several async validator functions.
  An element can not be saved until all validator functions pass.
- errors (`withErrors(errors: FormError[])`): The error messages that can be displayed on the form fields.
  `FormError` is an interface that has two strings: `key` and `msg`.
  Key is the error name that any validator you specified might add to the errors of the form control (e.g: 'required' when using Validators.required).
  Msg is the message that will be displayed if the given key is found in the errors of the form control.
- valueChanges (`withValueChanges(valueChangesFn: (value: F, data: T[P], dataParent: T, dataList: T[]) => void)`) :
  Listen for changes the user makes to any cell of this column.
  Under the hood, this uses the valueChanges Observable of the form control.
  The `value` passed to the `valueChangesFn` will be the new value.
  The `data` will be the last saved value of this property of the element.
  Likewise, dataParent will be the last saved element and `dataList` will contain all data in the un-edited state.
- init (`withInit(initFn: (data: T[P], dataParent: T, dataList: T[]) => F)`): If you specify this function, it will be executed
  when the form field is created (e.g. when the user hits the edit button on a row).
  The function should transform the property of your model that this column describes into whatever the form field needs.
  Depending on the form field you chose, this could be for example string (text/large text input) or number (number input).
  This means that you could use e.g. a date form field even though the property on your model is not a date, as long as you use withInit and withApply to transform the value.
- apply (`withApply(applyFn: (value: F, data: T[P], dataParent: T, dataList: T[]) => void)`) : If you specify this function, it will be executed when the user saves a row.
  The function should transform the value from the form field (e.g. Date if you use a date input)
  in a way that it can be set as the property of your model.
  If omitted, the value is applied directly.
  You should only omit this function if the property datatype equals the form field data type.
- focus (`withFocus(focus: boolean)`): Default is false. If set to true, the input of this form field will be focused when the user clicks add or edit.
- onDirectEditModelChange (`withOnDirectEditModelChange(onModelChange: (value: F, data: T[P], dataParent: T, dataList: T[]) => void)`): This callback is only available
  when using directEdit. It can be used to observe, prevent or change the changes the user makes in the form field.
  When this callback is supplied and Angular calls ngModelChange, instead of updating the model directly, this callback will be called.
  Note that this means you have to change the model yourself. You can use the parameters of the callback for this,
  which include not only the new value of the form field, but also the current property value (`data`, normally this equals the old value),
  the whole element (`dataParent`) and the list of all elements (`dataList`).

Note that placeholders, hints, validators and errors will not work on checkbox form fields.

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

create(): ComplexTestData {
  return new ComplexTestData(42, 'New Entry', new TestData('key', 'value'));
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

#### Keeping editing status

Normally, if you reassign the data after an edit to update the table state and display the newly added or edited data,
the editing-state of the table row that was being edited will automatically be reset.

In some cases, this can be unintended behaviour, e.g. if the backend notices an error in the data and wont let the user save
the element.
For those cases, there is an option on the simplemattable element called `keepStatus`.
If set to true, the editing-state of an element will not be reset, even if the data is reassigned, unless the object reference changes.
So if you replace the element with a completely new one, the state for that row will reset,
but if you just do `this.data = this.data.slice(0)`, the row will stay in editing-mode.

### Pagination

Simplemattable supports two kinds of pagination: Frontend-only-pagination and backend supported pagination.

Frontend-pagination is quite easy. Simply set the `paginator` input parameter of simplemattable to true. The Angular Material paginator will then be bound to the internal datasource.
The user will be able to click through the pages of your data array.

The problem with frontend pagination is that all the data has to be prefetched. When working with large data sets which have to be fetched from a backend server,
this might not be what you want.

When using backend pagination, only the data items which are displayed will be fetched. To use backend pagination, your backend must be able to:

- Return the count of the data items (To show the count in the paginator)
- Return a subset of all data items according to a page index and page size

If your backend server possesses such capabilites, you can use simplemattable to make use of this functionality.

First, set the `paginator` and `backendPagination` input parameters to true. Then retrieve the count of your data items from the backend and
feed the result into the `paginatorLength` input parameter.

From here, you have two options to continue:

1. Use the `page` output parameter
2. Use the `getPage` input parameter

The `page` output parameter forwards the `PageEvent` which is generated by the Material Paginator (see [the Angular Material docs](https://material.angular.io/components/paginator/api#PageEvent)).
You can then use the page event to fetch the next page from your server. Put the result into the `data` parameter to display the data items.
As with the add/edit/delete events, you have to change the reference of your data array after changing the data.
So if you have problems displaying your data, first check that the array reference you are setting the `data` input parameter is a new reference
(which should be the case if you are fetching data from your server using a Promise/Observable).

The `getPage: (offset: number, limit: number) => Observable<T[]>` input parameter is a function which takes the page index (offset) and
page size (limit) and returns an observable, which simplemattable will then use to fetch the data of the next page.
When using this approach, the getPage function acts as the glue between your server and simplemattable. While waiting for the observable to finish, simplemattable will show a progress spinner. If the observable fails (e.g. http request is unsuccessful), the progress spinner disappears and an event with the error is emitted by the `error` output paremeter.
To further reduce bloat, simplemattable will fetch the first page of data itself using the default size and page index 0.
This only works if the `getPage` parameter was set when simplemattable was constructed.
Note that `this` in the supplied function will be the simplemattable component by default. To change this back to your own component, use `.bind(this)` when supplying the function.
See [the demo](https://simplex24.de/smc-demo/pagination) for an example.

If you want to programmatically change the page size or page index, use the `pageSettings` input parameter.
Create a new `PageSettings` object and fill the pageIndex, page Size or both to your liking. Simplemattable will automatically detect the change
and forward the new settings to the paginator. Also, a new page event will be emitted, so you normally do not need to write any extra code.

All you need to do to go back to the first page, assuming you bound the pageSettings variable to the `pageSettings` input parameter of simplemattable, is:

```
this.pageSettings = {
  pageIndex: 0
};
```

### Infinite Scrolling

When infinite scrolling is used, the user has to scroll to the bottom to fetch the next page of data.
You can turn on infinite scrolling via the `infiniteScrolling` flag.

You can further customize the page loading behaviour via `infiniteScrollingPageSize` and `infiniteScrollingHeight`.
`infiniteScrollingPageSize` controls the page size while `infiniteScrollingHeight` controls at which scrolling point the next page will be fetched. E.g. if you set a height of 200px, which is also the default value, the next page will be fetched when the user is 200px or less away from the bottom.
`infiniteScrollingHeight` takes a height object, which can be percent or pixel based.

The loading itself is done in the same way as pagination. You supply an observable in the `getPage` parameter, which will then be called on page fetch. Also, the `page` event will be fired when a new page should be loaded. For more information, see the pagination section above.

If you need to reset the table content (e.g. because the user triggered a new search),
just assign a new `pageSettings` object with a `pageIndex` of 0.
If you need to scroll to a specific element, get a reference of simplemattable via `@ViewChild` and call the `scrollToIndex` method.
See [the demo](#https://smc-demo.simplex24.de/infinite-scroll) for an example of both resetting and scrolling to a specific index.

### Progress Spinner

You can turn on a progress spinner by setting the input parameter `loading` to true.
This will spawn a progress spinner with a transparent background in front of the table.
Note that the table will have a minimum height of 200px while loading so the progress spinner has enough space.

The progress spinner will be automatically turned on and of if you use the `getPage` input parameter (see [the pagination section](#pagination)).
Otherwise, recommended usage would be to turn on the progress spinner while loading your data. For example, in your component:

```
loading = true;
data: TestData[] = [];

ngOnInit() {
  this.myService.loadMyData().subscribe(data => {
    this.data = data;
    this.loading = false;
  });
}
```  

### Custom Filter

If you want to use the filter feature of simplemattable by setting the `filter` input parameter to true, you will normally
achieve acceptable results using the provided default filter. In some situations, however, it might occur that you want to
define the search function yourself, e.g. when you want to fetch the search results from your server. In those cases,
set the `noOpFilter` input parameter to true. This will disable the default filter behaviour and emit all search term changes
to the `search` output parameter. You can bind to this parameter and perform your custom filtering. If you change the data array
without assigning a new array reference, make sure to reassign the array after the change
using `this.data = data.slice(0);` (assuming your array is called `data`).

When using the filter in combination with the backend paginator,
you might have to include some logic in your filter/getPage/page methods to make sure that the search results do not get overriden
by page changes. (e.g. adjusting the `paginatorLength` and keeping state whether to fetch the next page from server or from search results)

## Contributing

The Sourcecode is in a public github repository. You may contribute by opening pull requests
if you have any nice ideas for improvements, new features, bugfixes, unittests, ...

If there are any problems or if you have any questions, feel free to contact me.
You can find my email address in the [authors section](#authors).

If you want to test your changes locally, simply run `ng serve` to start up the demo application.
Changes made in the library are immediately reflected in the demo application. Feel free to add additional pages
in the demo when adding new features.

## Change History

There will be new versions when new features are added or a new Angular version releases.

History (Version in parentheses is required Angular Version):

+ 18.0: Upgrade to Angular 18
+ 17.7: Add rowEditDisabledFn and rowDeleteDisabledFn to disable edit or delete on certain rows
+ 17.6: Add selectOnRowClick input to simpletable to allow selecting the row via click on any cell of the row
+ 17.5: Add header tooltip to simpletable
+ 17.4: After a data update in virtual scroll simpletable, checked items that were not removed now stay checked instead of resetting
+ 17.3: Resizable columns in virtual scroll simpletable
+ 17.2: Clickable footer row
+ 17.1: added smc-simpletable for virtual scrolling support without material. Switched angular peer dependencies to >= instead of ^ for easier upgrading
+ 17.0: upgrade to angular 17
+ 16.3: add drag and drop for rows
+ 16.2: add resizable headers
+ 16.1: use string representation for sorting
+ 16.0: upgrade to angular 16
+ 15.2: remove recycle rows directive because it causes bugs with expandable rows
+ 15.1: fix textarea display bug
+ 15.0: upgrade to Angular 15, bugfix regarding default page size
+ 14.0: Remove @angular/flex-layout due to inactivity; upgrade to Angular 14
+ 13.6: Add tooltip position and header tooltip position
+ 13.5: Avoid initial data load before paginator initialization
+ 13.4: Added properties to disable the edit/save/add/delete buttons
+ 13.3: Added `keepStatus` option to keep editing status on data refresh
+ 13.2: Cache row styles / classes
+ 13.1: Allow footer function to return an observable
+ 13.0: Upgrade to angular 13
+ 12.5: Option to apply specific form fields for editing and adding
+ 12.4: Tooltips for action buttons (edit/delete/add)
+ 12.3: Fix initial page size via pageSettings bug
+ 12.2: Allow filter to query string representation when using transform with observables
+ 12.1: stop event propagation on form fields to avoid accidentally opening the detail row component
+ 12.0: upgrade to angular 12
+ 11.6: add header tooltips, dont show delete button while editing, add delete all button, add header buttons
+ 11.5: add mouse event parameter for onClick callbacks
+ 11.4: search / filter properties for customizable column filter
+ 11.3: startEdit / cancelEdit output events
+ 11.2: Tooltips for table cells
+ 6.5 (10.0) or 11.1: Async Validators and value changes listener for form fields
+ 11.0: Updated to angular 11
+ 6.4 (10.0): Scroll to element function for infinite scrolling
+ 6.3 (10.0): Allow observables in transform; page reset feature for infinite scrolling
+ 6.2 (10.0): Only render detail component when needed
+ 6.1 (10.0): Fixed cell data refresh bug. Added list of elements as third parameter. Added functionality to change page settings when using frontend pagination
+ 6.0 (10.0): Updated to angular 10
+ 5.4 (9.0): Expandable Rows
+ 5.3 (9.0): Footer Row
+ 5.2 (9.0): Better scrolling recognition for Infinite Scrolling (+ Demo Application complete overhaul)
+ 5.1 (9.0): Reordering of columns via drag and drop
+ 5.0 (9.0): Updated to angular 9
+ 4.0 (8.0): Performance upgrades
+ 3.8 (8.0): Sort event
+ 3.7 (8.0): rowNgStyle and rowNgClass
+ 3.6 (8.0): Filter labels; Clickable rows
+ 3.5 (8.0): Custom Components (External Component Injection)
+ 3.4 (8.0): Direct Edit output callback
+ 3.3 (8.0): Sticky columns and filtered data output parameter
+ 3.2 (8.0): Error output event
+ 3.1 (8.0): Infinite Scrolling
+ 3.0 (8.0): Updated to Angular 8
+ 2.5 (7.0): Programmatically change page index / size when using backend pagination
+ 2.4 (7.0): HTML refactoring, direct edit feature
+ 2.3 (7.0): Progress spinner and backend pagination
+ 2.2 (7.0): Refactored setting of column filter text
+ 2.1 (7.0): Checkbox form field
+ 2.0 (7.0): Switched from mat-table components to mat-table directives, thus switching to table layout;
  fixed some smaller bugs regarding adding of items, filtering and focus
+ 1.6 (7.0): Multiline header cells
+ 1.5 (7.0): Filter for Columns
+ 1.4 (7.0): Updated to Angular 7
+ 1.3 (6.1): Sticky header option, Angular Version updated to 6.1 (6.4 @angular/material)
+ 1.2 (6.0): Customizable icons and initial focus for input fields
+ 1.1 (6.0): Use enter to save on text/number input fields
+ 1.0 (6.0): Edit-mode in all its glory: edit/add/delete with text/largetext/number/date/select inputs
+ 0.12 (6.0): Max/min lines, option to hide text/columns on small screens, ngClass and ngStyle
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
"@angular/common": "^18.0.0",
"@angular/core": "^18.0.0",
"@angular/material": "^18.0.0",
"@angular/cdk": "^18.0.0",
"@angular/platform-browser": "^18.0.0"
```  

+ For use with Angular >= 6.0 and < 6.1.8, use Version 1.2 of simplemattable.
+ For use with Angular >= 6.1.8 and < 7.0, use Version 1.3 of simplemattable.
+ For use with Angular >= 7.0 and < 8.0, use Version 2.5.7 of simplemattable.
+ For use with Angular >= 8.0 and < 9.0, use Version 4.0 of simplemattable.
+ For use with Angular >= 9.0 and < 10.0, use Version 5.4 of simplemattable.
+ For use with Angular >= 10.0 and < 11.0, use Version 6.5 of simplemattable.
+ For use with Angular >= 11.0, use the newest version of simplemattable for your respective Angular version.

## Authors

Henning Wobken (henning.wobken@simplex24.de)

## License

This project is licensed under the MIT License
