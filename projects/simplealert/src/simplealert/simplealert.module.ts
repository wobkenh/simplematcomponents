import {NgModule} from '@angular/core';
import {SimplealertComponent} from './simplealert.component';
import {CommonModule} from '@angular/common';
import {MatButtonModule, MatCommonModule, MatIconModule} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatCommonModule,
    MatIconModule,
    MatButtonModule,
  ],
  declarations: [SimplealertComponent],
  exports: [SimplealertComponent]
})
export class SimplealertModule {
}
