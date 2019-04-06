import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {SimplealertModule} from '../../projects/simplealert/src/simplealert/simplealert.module';
import {MatButtonModule, MatCardModule, MatCommonModule, MatSidenavModule, MatTabsModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SimplemattableModule} from '../../projects/simplemattable/src/lib/simplemattable.module';

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
    SimplemattableModule,
    SimplemattableModule,
    MatTabsModule,
    MatSidenavModule,
    MatCardModule,
    // MatTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
