import {Align} from './align.model';

export class TableColumn<T, P extends keyof T> {

  constructor(public name: string,
              public property: P,
              public transform?: (data: T[P], dataParent: T) => string,
              public width?: number,
              public align: Align = Align.LEFT,
              public sortable: boolean = true,
              public sortTransform?: (data: T[P], dataParent: T) => number | string,
              public visible: boolean = true,
              public icon?: (data: T[P], dataParent: T) => string) {
  }

  public withTransform(transformFn: (data: T[P], dataParent: T) => string) {
    this.transform = transformFn;
    return this;
  }

  public withSortTransform(transformFn: (data: T[P], dataParent: T) => number | string) {
    this.sortTransform = transformFn;
    return this;
  }

  public withWidth(width: number) {
    this.width = width;
    return this;
  }

  public withAlign(align: Align) {
    this.align = align;
    return this;
  }

  public isSortable(sortable: boolean) {
    this.sortable = sortable;
    return this;
  }

  public isVisible(visible: boolean) {
    this.visible = visible;
    return this;
  }

  public withIcon(iconNameFn: (data: T[P], dataParent: T) => string) {
    this.icon = iconNameFn;
    return this;
  }
}
