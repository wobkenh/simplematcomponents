import { Component, ComponentRef, Input, OnChanges, Type, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'smc-external-component-wrapper',
  templateUrl: './external-component-wrapper.component.html',
  styleUrls: ['./external-component-wrapper.component.css']
})
export class ExternalComponentWrapperComponent implements OnChanges {

  @Input() ngComponent: Type<any>;
  @Input() ngComponentInput: (component: any, data: any, dataParent: any, dataList: any) => void;
  @Input() tcolProperty: any;
  @Input() dataParent: any;
  @Input() dataList: any;

  private componentRef: ComponentRef<any>;

  constructor(private viewContainerRef: ViewContainerRef) {
  }

  ngOnChanges() {
    this.viewContainerRef.clear();
    this.componentRef = this.viewContainerRef.createComponent(this.ngComponent);
    if (this.ngComponentInput) {
      this.ngComponentInput(this.componentRef.instance, this.dataParent[this.tcolProperty], this.dataParent, this.dataList);
    }
  }

  refreshInput() {
    this.ngComponentInput(this.componentRef.instance, this.dataParent[this.tcolProperty], this.dataParent, this.dataList);
  }

}
