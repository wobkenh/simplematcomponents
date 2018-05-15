# simplealert

SimpleAlert is a simple Angular component for info or error alerts, inspired by bootstrap alerts. 
It can be dynamically opened/closed with opening/closing animations and can contain any content via ng-content.

### Prerequisites

This Dependency is for use with Angular Material Design only. As of the first version, 
it requires Angular Material 6.0 or above (see version section for more information).

## Preview

![Info Alert](https://simplex24.de/info.png "Info Alert")
![Error Alert](https://simplex24.de/error.png "Error Alert")

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
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

```

## Usage

To use Simplealert in your component, you need to define at least two variables in your component:

```
export class AppComponent implements OnInit {
  alertType = AlertType;
  isOpen = true;
  ...
}
```

The AlertType needs to be imported this way since you cant access Enums directly in your html.
The isOpen flag will be used to bind to the state of the alert.

After this is done, you can describe your info alert in the corresponding html file:

```
<smc-simplealert [(isOpen)]="isOpen" [type]="alertType.INFO">This is an info alert!</smc-simplealert>
```

If you want to open or close the alert, simply change the value of isOpen. The alert can be closed by the user. 
If this happens, the state will be synced back to isOpen using two-way-databinding.

## Contributing

The Sourcecode is in a private repository for now. 
If anyone is interested in contributing, email me and I will transfer this library to a public github or gitlab repository.
For my email address, see the [authors section](#authors).

## Versioning

There will be new versions when new features are added or a new Angular version releases.

History (Version in paranthesis is required Angular Version):
+ 0.0 (6.0): First Version

## Upcoming Features
+ Danger Alert

## Authors

Henning Wobken (henning.wobken@simplex24.de)

## License

This project is licensed under the MIT License
