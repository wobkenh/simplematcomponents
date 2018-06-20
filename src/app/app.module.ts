import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {SimplemattableModule} from 'simplemattable';
import {AppComponent} from './app.component';
import {SimplealertModule} from '../../projects/simplealert/src/simplealert/simplealert.module';
import {MatButtonModule, MatCommonModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatCommonModule,
    MatButtonModule,
    SimplealertModule,
    SimplemattableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
