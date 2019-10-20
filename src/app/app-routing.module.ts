import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {InfiniteScrollingComponent} from './infinite-scrolling/infinite-scrolling.component';
import {SimpleComponent} from './simple/simple.component';
import {TransformComponent} from './transform/transform.component';
import {WidthHeightComponent} from './width-height/width-height.component';
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
import {AlertComponent} from './alert/alert.component';
import {HomeComponent} from './home/home.component';
import {StickyColumnsComponent} from './sticky-columns/sticky-columns.component';
import {ComponentInjectionComponent} from './component-injection/component-injection.component';


const routes: Routes = [
  {path: 'infinite-scroll', component: InfiniteScrollingComponent},
  {path: 'simple', component: SimpleComponent},
  {path: 'transform', component: TransformComponent},
  {path: 'width-height', component: WidthHeightComponent},
  {path: 'align', component: AlignComponent},
  {path: 'sortable', component: SortableComponent},
  {path: 'visibility', component: VisibilityComponent},
  {path: 'icons-buttons', component: IconsButtonsComponent},
  {path: 'multiline', component: MultilineComponent},
  {path: 'custom-css', component: CustomCssComponent},
  {path: 'filter', component: FilterComponent},
  {path: 'forms', component: FormsComponent},
  {path: 'sticky-columns', component: StickyColumnsComponent},
  {path: 'scrollable', component: ScrollableComponent},
  {path: 'complete', component: CompleteComponent},
  {path: 'pagination', component: PaginationComponent},
  {path: 'direct-edit', component: DirectEditComponent},
  {path: 'alert', component: AlertComponent},
  {path: 'custom-components', component: ComponentInjectionComponent},
  {path: '', component: HomeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
