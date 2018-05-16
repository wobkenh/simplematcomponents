# simplemattable

SimpleMatTable is an abstraction of MatTable from the @angular/material dependency. 
It allows you to quickly and in a typesafe way define tables. 
This is perfect if you want to display data in a table and do not need full control over the table HTML.

Instead of copy/pasting the HTML for each column, you can describe the columns in a declarative way via Typescript code.
A lot of different options like align, buttons, icons and even custom css allow you to further customize your table.

### Prerequisites

Simplemattable is for use with Angular Material Design only. As of the first version, 
it requires Angular Material 6.0 or above.

For a detailed list of neccessary dependencies, see [section Dependencies](#dependencies) .

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
this.columns[0].visible = !this.columns[0].visible;
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
- width (`.withWidth(width: (number | Width | string))`): The width of the column. The property itself is the string that will later be used by fxflex. If you do not specify the width, the flex value `1 1 0px` will be used. This function accepts either a number, a string or a Width object:
  + number: flex string will be `0 0 <number>px`
  + string: the string will be interpreted by fxFlex as is, so pass a valid fxFlex string, [for more information see here](https://github.com/angular/flex-layout/wiki/fxFlex-API).
  + Width: Width allows you to enter the width in a typesafe way. 
  You can use `Width.px(pixel: number)` to get a pixel based width or `Width.pct(percent: number)` for percent based width. 
  Additionally, you can use the methods `.shrink()` and `.grow()` to turn on shrink or grow respectively, which are both turned off by default. 

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

- maxLines (`.withMaxLines(maxLineLength: number)`): Maximum lines of text in a cell. 
If not specified, a span will be used that ignores linebreaks in the text and spans over as many lines as needed.
If maxLines is specified, a textarea with the stated amount of maximum lines will be used. The textarea is able to display linebreaks appropriately. It is always readonly.

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

- ngStyle: (`.withNgStyle(ngStyleFn: (data: T[P], dataParent: T) => Object)`): 
If you want to apply custom inline css to the table cells of a column, you can add the ngStyle function.
It must return something that is parsable by the ngStyle directive. For more information on ngStyle [see the Angular docs](https://angular.io/api/common/NgStyle).
You do not need to use !important on ngStyle. For example, you could change the background color depending on id like this even when the column is clickable: 
`.withNgStyle((id) => ({'background-color': id < 3 ? '#992222' : 'transparent'}))` 

    
## Contributing

The Sourcecode is in a private repository for now. 
If anyone is interested in contributing, email me and I will transfer this library to a public github or gitlab repository.
For my email address, see the [authors section](#authors).

## Versioning

There will be new versions when new features are added or a new Angular version releases.

Version 1.0 will release when the editing-mode-feature is fully functional.

History (Version in parenthesis is required Angular Version):
+ 0.0 (6.0): First Version
+ 0.1 (6.0): Alignment
+ 0.2 (6.0): Filtering using display values instead of object property values
+ 0.3 (6.0): Sorting
+ 0.4 (6.0): Removed outer div, now using V6.0 of Angular fxFlex (@angular/flex-layout)
+ 0.5 (6.0): Allow for multiple columns to use the same property
+ 0.6 (6.0): Sort Transform Function for custom sorting
+ 0.7 (6.0): Hidden columns and better listening mechanism for data change detection
+ 0.8 (6.0): Icon support, added the row data object as second parameter to all TableColumn function properties
+ 0.9 (6.0): Click listener support
+ 0.10 (6.0): Buttons
+ 0.11 (6.0): Width rework + TableColumn constructor refactor
+ 0.12 (6.0): max/min lines, option to hide text/columns on small screens, ngClass and ngStyle

## Upcoming Features
+ Edit-Mode: Clicking an edit button in the last column will turn all the fields of the row into form fields for editing. 
Next to the edit button in each row, there will be an (optional) delete button. 
Additionally, there will be an (optional) add-button in the table header.

## Dependencies

Simplemattable only uses peer dependencies, so you need the following packages (with compatible versions) in your package.json:

```
"@angular/common": "^6.0.0",
"@angular/core": "^6.0.0",
"@angular/material": "^6.0.0",
"@angular/cdk": "^6.0.0",
"@angular/platform-browser": "^6.0.0",
"@angular/flex-layout": "^6.0.0-beta.15"
```  

## Authors

Henning Wobken (henning.wobken@simplex24.de)

## License

This project is licensed under the MIT License
