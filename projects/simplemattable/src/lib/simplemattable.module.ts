import { NgModule } from '@angular/core';
import { SimplemattableComponent } from './simplemattable/simplemattable.component';
import {
  MatButtonModule,
  MatCommonModule, MatDatepickerModule,
  MatIconModule,
  MatInputModule, MatNativeDateModule,
  MatPaginatorModule,
  MatSortModule,
  MatTableModule
} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatCommonModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    BrowserAnimationsModule,
    MatPaginatorModule
  ],
  declarations: [SimplemattableComponent],
  exports: [SimplemattableComponent]
})
export class SimplemattableModule { }
