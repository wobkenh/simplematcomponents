import {Align} from './align.model';
import {ButtonType} from './button-type.model';
import {ThemePalette} from '@angular/material';
import {Width} from './width.model';

export class TableColumn<T, P extends keyof T> {

  public transform: (data: T[P], dataParent: T) => string;
  public width: string = '1 1 0px';
  public align: Align = Align.LEFT;
  public sortable: boolean = true;
  public sortTransform: (data: T[P], dataParent: T) => number | string;
  public visible: boolean = true;
  public icon: (data: T[P], dataParent: T) => string;
  public onClick: (data: T[P], dataParent: T) => void;
  public button: ButtonType;
  public buttonColor: ThemePalette;
  public maxLines: number;
  public minLines: number = 1;

  constructor(public name: string,
              public property: P) {
  }

  public withTransform(transformFn: (data: T[P], dataParent: T) => string) {
    this.transform = transformFn;
    return this;
  }

  public withSortTransform(transformFn: (data: T[P], dataParent: T) => number | string) {
    this.sortTransform = transformFn;
    return this;
  }

  public withWidth(width: (number | Width | string)) {
    if (typeof width === 'string') {
      this.width = width;
    } else if (typeof width === 'number') {
      this.width = '0 0 ' + width.toString() + 'px';
    } else {
      this.width = width ? width.getFlex() : '1 1 0px';
    }
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

  public withOnClick(onClickFn: (data: T[P], dataParent: T) => void) {
    this.onClick = onClickFn;
    return this;
  }

  public withButton(buttonType: ButtonType) {
    this.button = buttonType;
    return this;
  }

  public withButtonColor(buttonColor: ThemePalette) {
    this.buttonColor = buttonColor;
    return this;
  }

  public withMaxLines(maxLineLength: number) {
    this.maxLines = maxLineLength;
    return this;
  }

  public withMinLines(minLineLength: number) {
    this.minLines = minLineLength;
    return this;
  }
}
