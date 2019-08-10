import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {SimplealertModule} from '../../projects/simplealert/src/simplealert/simplealert.module';
import {MatButtonModule, MatCardModule, MatCommonModule, MatSidenavModule, MatTabsModule, MatListModule, MatIconModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SimplemattableModule} from '../../projects/simplemattable/src/lib/simplemattable.module';
import { InfiniteScrollingComponent } from './infinite-scrolling/infinite-scrolling.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { AppRoutingModule } from './app-routing.module';
import { SimpleComponent } from './simple/simple.component';
import { TransformComponent } from './transform/transform.component';
import { AlignComponent } from './align/align.component';
import { SortableComponent } from './sortable/sortable.component';
import { VisibilityComponent } from './visibility/visibility.component';
import { IconsButtonsComponent } from './icons-buttons/icons-buttons.component';
import { MultilineComponent } from './multiline/multiline.component';
import { CustomCssComponent } from './custom-css/custom-css.component';
import { FilterComponent } from './filter/filter.component';
import { FormsComponent } from './forms/forms.component';
import { ScrollableComponent } from './scrollable/scrollable.component';
import { CompleteComponent } from './complete/complete.component';
import { PaginationComponent } from './pagination/pagination.component';
import { DirectEditComponent } from './direct-edit/direct-edit.component';
import { WidthHeightComponent } from './width-height/width-height.component';
import { AlertComponent } from './alert/alert.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    InfiniteScrollingComponent,
    SidenavComponent,
    SimpleComponent,
    TransformComponent,
    AlignComponent,
    SortableComponent,
    VisibilityComponent,
    IconsButtonsComponent,
    MultilineComponent,
    CustomCssComponent,
    FilterComponent,
    FormsComponent,
    ScrollableComponent,
    CompleteComponent,
    PaginationComponent,
    DirectEditComponent,
    WidthHeightComponent,
    AlertComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatCommonModule,
    MatButtonModule,
    SimplealertModule,
    SimplemattableModule,
    SimplemattableModule,
    MatTabsModule,
    MatSidenavModule,
    MatCardModule,
    MatListModule,
    MatIconModule
    // MatTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
