# simplemattable

SimpleMatTable is an abstraction of MatTable from the @angular/material dependency. It allows you to quickly and in a typesafe way define simple tables. 
This is perfect if you just want to display some data in a table and do not need full control over the table HTML.

### Prerequisites

This Dependency is for use with Angular Material Design only. As of the first version, it requires Angular Material 6.0 or above.

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

Lets say you have a model that you want to display in a table, for example:

```
class TestData {
  constructor(public key: string, public value: string) {
  }
}
```

In your component (e.g. AppComponent) you can then define your colums like this:

```
columns = [
  new TableColumn<TestData, 'key'>('Key', 'key')
    .withWidth(100).withTransform(data => data.substring(3)),
  new TableColumn<TestData, 'value'>('Value', 'value')
];
```

The TableColumn class requires two generics. The first is the class of your model, the second is the property this column describes. 
The property-generic uses "keyof T", so your IDE will show an error at compile time if you enter a name that does not belong to a property of T.

The Constructor of TableColumn requires you to specify the string that will be displayed in the table header and (again) the name of the property on the model. 
You already specified the property name in the generics, but since information about generics is not available at runtime, you need to specify it here again. 
Fortunately, the property in the constructor is also typesafe.

TableColumn has three more optional parameters, allowing you to further customize the table:
- transform (add it using the 3rd constructor parameter or .withTransform()): Transform is a function that takes the property of your model (e.g. the key of TestData) and returns a string representation. 
This is helpful if e.g. your Model contains a Date but you do not want the standard JS string representation of date to show, but rather your preferred format. 
- width (4th contructor parameter or .withWidth()): Here you can specify the width of the column in pixel. If you do not specify the width, the flex value 1 1 0px will be used.
- align (5th constructor parameter or .withAlign()): Sets the text align within the column. Header and Cell content will both be aligned. Default is left align. 

After you defined your table columns, you can bind them to the html element using:

```
<smc-simplemattable [data]="testData" [columns]="columns" [paginator]="true" [filter]="true"></smc-simplemattable>
```

where testData is an array of your model and columns are the TableColumns you defined earlier.

Additionally, you can turn on a paginator and a filter. These are the standard MatTable Features that are also well described at
https://material.angular.io/components/table/overview.
The paginator and filter are optional. If omitted, the flags will default to false.

## Contributing

The Sourcecode is in a private repository for now. 
If anyone is interested in contributing, email me and I will transfer this library to a public github or gitlab repository.

## Versioning

There will be new versions when new features are added or a new Angular version releases.

History (Version in paranthesis is required Angular Version):
+ 0.0 (6.0): First Version
+ 0.1 (6.0): Alignment

## Upcoming Features
+ Filter using display values and not object property values
+ Padding corrections for more space on small screens (xs)
+ Edit-Mode: Clicking a new edit button in the last column will turn all the fields into form fields for editing

## Authors

Henning Wobken (henning.wobken@simplex24.de)

## License

This project is licensed under the MIT License
