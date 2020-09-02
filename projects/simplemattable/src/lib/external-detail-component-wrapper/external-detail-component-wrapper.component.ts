import {Component, ComponentFactoryResolver, ComponentRef, Input, OnChanges, Type, ViewContainerRef} from '@angular/core';
import {DetailRowComponent} from '../model/detail-row-component';

@Component({
  selector: 'smc-external-detail-component-wrapper',
  templateUrl: './external-detail-component-wrapper.component.html',
  styleUrls: ['./external-detail-component-wrapper.component.css']
})
export class ExternalDetailComponentWrapperComponent<T> implements OnChanges {

  @Input() ngComponent: Type<DetailRowComponent<T>>;
  @Input() element: T;
  @Input() dataList: T[];

  private componentRef: ComponentRef<DetailRowComponent<T>>;

  constructor(private resolver: ComponentFactoryResolver, private viewContainerRef: ViewContainerRef) {
  }

  ngOnChanges() {
    this.viewContainerRef.clear();
    this.componentRef = this.viewContainerRef.createComponent(this.resolver.resolveComponentFactory(this.ngComponent));
    this.componentRef.instance.onInput(this.element, this.dataList);
  }

}
