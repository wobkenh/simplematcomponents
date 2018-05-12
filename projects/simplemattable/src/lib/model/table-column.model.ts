import {Align} from './align.model';

export class TableColumn<T, P extends keyof T> {

  constructor(public name: string,
              public property: P,
              public transform?: (data: T[P]) => string,
              public width?: number,
              public align: Align = Align.LEFT) {
  }

  public withTransform(transformFn: (data: T[P]) => string) {
    this.transform = transformFn;
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
}
