# simplemattable

SimpleMatTable is an abstraction of MatTable from the @angular/material dependency. It allows you to quickly and in a typesafe way define simple tables. 
This is perfect if you just want to display some data in a table and do not need full control over the table HTML.

Instead of copy/pasting the HTML for each column, you can describe the columns in a declarative way via Typescript code.

### Prerequisites

This Dependency is for use with Angular Material Design only. As of the first version, 
it requires Angular Material 6.0 or above (see Version section for more information).

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
  new TableColumn<TestData, 'key'>('Key', 'key')
    .withWidth(100).withTransform(data => data.substring(3)).withAlign(Align.CENTER),
  new TableColumn<TestData, 'value'>('Value', 'value')
];
```

The TableColumn class requires two generics. The first is the class of your model, the second is the property this column describes. 
The property-generic uses "keyof T", so your IDE will show an error at compile time if you enter a name that does not belong to a property of T.

The Constructor of TableColumn requires you to specify the string that will be displayed in the table header and (again) the name of the property on the model. 
You already specified the property name in the generics, but since information about generics is not available at runtime, you need to specify it here again. 
Fortunately, the property in the constructor is also typesafe.

If you are looking for more customization options for you columns, have a look at section "TableColumn Options" later in this chapter.

### Table

After you defined your table columns, you can bind them to the html element using:

```
<smc-simplemattable [data]="testData" [columns]="columns" [paginator]="true" [filter]="true" [sorting]="true"></smc-simplemattable>
```

where testData is an array of your model and columns are the TableColumns you defined earlier.

Additionally, you can turn on a paginator, a filter and sorting. These are the standard MatTable Features that are also well described at
https://material.angular.io/components/table/overview.
The paginator, filter and sorting are optional. If omitted, the flags will default to false.

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
  new TableColumn<ComplexTestData, 'data'>('Key', 'data', (data) => data.key),
  new TableColumn<ComplexTestData, 'data'>('Value', 'data', (data) => data.value)
];
```

You can also use .withTransform instead of the 3rd constructor parameter (see next section "TableColumn Options").

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

### TableColumn Options

TableColumn has several optional parameters, allowing you to further customize the table:
- transform (3rd constructor parameter or .withTransform()): Transform is a function that takes the property of your model (e.g. the key of TestData) and returns a string representation. 
This is helpful if e.g. your Model contains a Date but you do not want the standard JS string representation of date to show, but rather your preferred format. 
- width (4th constructor parameter or .withWidth()): Here you can specify the width of the column in pixel. If you do not specify the width, the flex value 1 1 0px will be used.
- align (5th constructor parameter or .withAlign()): Sets the text align within the column. Header and Cell content will both be aligned. Default is left align.
- sortable (6th constructor parameter or .isSortable()): If sorting is enabled, you can disable sorting for certain columns by setting this property to false (default: true)
- sortTransform (7th parameter or .withSortTransform()): If you need custom sorting, you can specify sortTransform, which is a function that takes the property of your model 
and returns a number or string representation that is used to sort the table. Sorting will use the following representation of a column:
  1. If sortTransform is available, it will apply the data to the supplied function
  2. If the property is of type Date, it will use .toISOString(). This will not work with nested objects. The date has to be a property of your model class.
  3. If the property is of type object and transform is available, it will apply the data to the supplied function
  4. If earlier checks failed, it will use the property value
- visible (8th parameter or .isVisible()): Can be used to change the visibility of a column


## Contributing

The Sourcecode is in a private repository for now. 
If anyone is interested in contributing, email me and I will transfer this library to a public github or gitlab repository.
For my email address, see the [authors section](#authors).

## Versioning

There will be new versions when new features are added or a new Angular version releases.

History (Version in paranthesis is required Angular Version):
+ 0.0 (6.0): First Version
+ 0.1 (6.0): Alignment
+ 0.2 (6.0): Filtering using display values instead of object property values
+ 0.3 (6.0): Sorting
+ 0.4 (6.0): Removed outer div, now using V6.0 of Angular fxFlex (@angular/flex-layout)
+ 0.5 (6.0): Allow for multiple columns to use the same property
+ 0.6 (6.0): Sort Transform Function for custom sorting
+ 0.7 (6.0): Hidden columns and better listening mechanism for data change detection

## Upcoming Features
+ Support for Links, Buttons and Icons in table cells
+ Edit-Mode: Clicking an edit button in the last column will turn all the fields of the row into form fields for editing. 
Next to the edit button in each row, there will be an (optional) delete button. 
Additionally, there will be an (optional) add-button in the table header.
+ Right now, the sort icons in the table header are invisible if disabled, but are still registered in the dom with their full size. 
If center Align is supplied, this makes the header move a little to the left, which is unintended. I will try to fix this in a future version.

## Authors

Henning Wobken (henning.wobken@simplex24.de)

## License

This project is licensed under the MIT License
