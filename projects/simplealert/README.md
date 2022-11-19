# simplealert

SimpleAlert is a simple Angular component for info, error, danger and success alerts, inspired by bootstrap alerts. 
It can be dynamically opened/closed with opening/closing animations and can contain any content via ng-content.

### Prerequisites

This Dependency is for use with Angular Material Design only. As of the first version, 
it requires Angular Material 6.0 or above (see version section for more information).

## Preview

[Demo](https://simplex24.de/smc-demo#infoAlert "Demo")

## Installing

Start with a normal Angular App with Material Design installed.

Then install Simplealert using

```
npm install simplealert
```

Then import the SimplealertModule into your AppModule. The following snippet shows the minimum AppModule you need to use Simplealert:

```
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {SimplealertModule} from '../../projects/simplealert/src/simplealert/simplealert.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SimplealertModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

```

## Usage

To use Simplealert in your component, describe your info alert in the corresponding html file:
                                      
```
<smc-simplealert [(isOpen)]="isOpen" [type]="'info'">This is an info alert!</smc-simplealert>
```

You can either use the type AlertTypeString, which is one of the following strings: `'info'`, `'error'`, `'warn'` or `'danger'`
or you can use the AlertType enum. If you use the enum, define the enum in your component like this:
`alertType = AlertType;` so you can access it in your html. 

You can either bind the is open input/output to a boolean variable in your component or only bind to the input variable isOpen of smc-simplealert and set it to true. 
If you chose to do the latter, the alert will be open initially. The user can click it away, but can't reopen it. 
If the user should be able to open the alert back up, you need to two way bind to isOpen and set it to true on user interaction, e.g. with the click on an info button.

## Contributing

The Sourcecode is in a public github repository. You may contribute by opening pull requests
if you have any nice ideas for improvements, new features, bugfixes, unittests, ...

If there are any problems or if you have any questions, feel free to contact me.
You can find my email address in the [authors section](#authors). You can also open up an issue on github.

## Versioning

There will be new versions when new features are added or a new Angular version releases.

History (Version in parentheses is required Angular Version):
+ 15.0: Updated to Angular 15
+ 14.0: Updated to Angular 14 / Removed @angular/flex-layout
+ 1.2 (7.0): Updated to Angular 7
+ 1.1 (6.0): Improved responsiveness on very small screens (xs)
+ 1.0 (6.0): Danger + Success alert, AlertTypeString
+ 0.0 (6.0): First Version

## Upcoming Features
+ None, but feel free to contribute if you have any ideas :)

## Dependencies

Simplealert only uses peer dependencies, so you need the following packages (with compatible versions) in your package.json:

```
"@angular/common": "^15.0.0",
"@angular/core": "^15.0.0",
"@angular/material": "^15.0.0",
"@angular/cdk": "^15.0.0",
"@angular/platform-browser": "^15.0.0",
```  

## Authors

Henning Wobken (henning.wobken@simplex24.de)

## License

This project is licensed under the MIT License
