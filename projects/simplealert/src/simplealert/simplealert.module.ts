import { NgModule } from '@angular/core';
import { SimplealertComponent } from './simplealert.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCommonModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    MatCommonModule,
    MatIconModule,
    MatButtonModule,
  ],
  declarations: [SimplealertComponent],
  exports: [SimplealertComponent]
})
export class SimplealertModule {
}
