import {NgModule} from '@angular/core';
import {SimplemattableComponent} from './simplemattable/simplemattable.component';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatCommonModule,
  MatDatepickerModule,
  MatIconModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSortModule,
  MatTableModule
} from '@angular/material';
import {MatInputModule} from '@angular/material/input';
import {FlexLayoutModule} from '@angular/flex-layout';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ExternalComponentWrapperComponent} from './external-component-wrapper/external-component-wrapper.component';
import { TableCellComponent } from './table-cell/table-cell.component';

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
    MatProgressSpinnerModule,
    MatSortModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    MatPaginatorModule,
    MatCheckboxModule
  ],
  declarations: [SimplemattableComponent, ExternalComponentWrapperComponent, TableCellComponent],
  exports: [SimplemattableComponent]
})
export class SimplemattableModule {
}
