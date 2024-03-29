import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {SimplealertModule} from '../../projects/simplealert/src/simplealert/simplealert.module';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatCommonModule} from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTabsModule} from '@angular/material/tabs';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SimplemattableModule} from '../../projects/simplemattable/src/lib/simplemattable.module';
import {InfiniteScrollingComponent} from './infinite-scrolling/infinite-scrolling.component';
import {AppRoutingModule} from './app-routing.module';
import {SimpleComponent} from './simple/simple.component';
import {TransformComponent} from './transform/transform.component';
import {AlignComponent} from './align/align.component';
import {SortableComponent} from './sortable/sortable.component';
import {VisibilityComponent} from './visibility/visibility.component';
import {IconsButtonsComponent} from './icons-buttons/icons-buttons.component';
import {MultilineComponent} from './multiline/multiline.component';
import {CustomCssComponent} from './custom-css/custom-css.component';
import {FilterComponent} from './filter/filter.component';
import {FormsComponent} from './forms/forms.component';
import {ScrollableComponent} from './scrollable/scrollable.component';
import {CompleteComponent} from './complete/complete.component';
import {PaginationComponent} from './pagination/pagination.component';
import {DirectEditComponent} from './direct-edit/direct-edit.component';
import {WidthHeightComponent} from './width-height/width-height.component';
import {AlertComponent} from './alert/alert.component';
import {HomeComponent} from './home/home.component';
import {StickyColumnsComponent} from './sticky-columns/sticky-columns.component';
import {ComponentInjectionComponent} from './component-injection/component-injection.component';
import {CustomTableCellComponent} from './custom-table-cell/custom-table-cell.component';
import {InternationalizationComponent} from './internationalization/internationalization.component';
import {PlaygroundComponent} from './playground/playground.component';
import {DragNDropColumnsComponent} from './drag-n-drop-columns/drag-n-drop-columns.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {HIGHLIGHT_OPTIONS, HighlightModule} from 'ngx-highlightjs';
import {FooterComponent} from './footer/footer.component';
import {ExpandableRowsComponent} from './expandable-rows/expandable-rows.component';
import {ExpandableRowDetailComponent} from './expandable-row-detail/expandable-row-detail.component';
import {TooltipComponent} from './tooltip/tooltip.component';
import {SlimComponent} from './slim/slim.component';

/**
 * Import specific languages to avoid importing everything
 * The following will lazy load highlight.js core script (~9.6KB) + the selected languages bundle (each lang. ~1kb)
 */
export function getHighlightLanguages() {
  return {
    typescript: () => import('highlight.js/lib/languages/typescript'),
    css: () => import('highlight.js/lib/languages/css'),
    xml: () => import('highlight.js/lib/languages/xml')
  };
}


@NgModule({
  declarations: [
    AppComponent,
    InfiniteScrollingComponent,
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
    HomeComponent,
    StickyColumnsComponent,
    ComponentInjectionComponent,
    CustomTableCellComponent,
    InternationalizationComponent,
    PlaygroundComponent,
    DragNDropColumnsComponent,
    FooterComponent,
    ExpandableRowsComponent,
    ExpandableRowDetailComponent,
    TooltipComponent,
    SlimComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatCommonModule,
    MatButtonModule,
    SimplealertModule,
    SimplemattableModule,
    MatTabsModule,
    MatSidenavModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    HighlightModule
  ],
  providers: [
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        languages: getHighlightLanguages()
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
