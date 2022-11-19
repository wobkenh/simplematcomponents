import {NgModule} from '@angular/core';
import {SimplemattableComponent} from './simplemattable/simplemattable.component';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatCommonModule, MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatIconModule} from '@angular/material/icon';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSelectModule} from '@angular/material/select';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ExternalComponentWrapperComponent} from './external-component-wrapper/external-component-wrapper.component';
import {TableCellComponent} from './table-cell/table-cell.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {FooterCellComponent} from './footer-cell/footer-cell.component';
import {ExternalDetailComponentWrapperComponent} from './external-detail-component-wrapper/external-detail-component-wrapper.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
  imports: [
    CommonModule,
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
    MatCheckboxModule,
    DragDropModule,
    MatTooltipModule,
    MatDividerModule
  ],
  declarations: [
    SimplemattableComponent,
    ExternalComponentWrapperComponent,
    TableCellComponent,
    FooterCellComponent,
    ExternalDetailComponentWrapperComponent
  ],
  exports: [SimplemattableComponent]
})
export class SimplemattableModule {
}
