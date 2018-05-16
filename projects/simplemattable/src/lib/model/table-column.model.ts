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
  public textHiddenXs: boolean = false;
  public textHiddenSm: boolean = false;
  public hiddenXs: boolean = false;
  public hiddenSm: boolean = false;

  constructor(public name: string,
              public property: P) {
  }

  /**
   * Function that returns the display value of a cell.
   * Use a function that returns empty string if you want to have nothing displayed.
   *
   * @param transformFn
   * @returns this
   */
  public withTransform(transformFn: (data: T[P], dataParent: T) => string) {
    this.transform = transformFn;
    return this;
  }

  /**
   * Function that returns the sort value of a cell.
   * Return type has to be either number or string.
   *
   * @param transformFn
   * @returns this
   */
  public withSortTransform(transformFn: (data: T[P], dataParent: T) => number | string) {
    this.sortTransform = transformFn;
    return this;
  }

  /**
   * Determines the width (flex value) to be used for the column.<br>
   *     number: pixel width of the column, results in 0 0 (number)px
   *     string: value will be passed to fxFlex as is
   *     Width: see Width class documentation
   *     Default is '1 1 0px'
   *
   * @param width
   * @returns this
   */
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

  /**
   * Determines align of the column. Default is left align.
   *
   * @param align see Align enum
   * @returns this
   */
  public withAlign(align: Align) {
    this.align = align;
    return this;
  }

  /**
   * Pass false to disable sorting for this column only.
   * Default is true (= sorting for this column enabled).
   *
   * @param sortable
   * @returns this
   */
  public isSortable(sortable: boolean) {
    this.sortable = sortable;
    return this;
  }

  /**
   * Can be used to hide a column. Default is true.
   *
   * @param visible
   * @returns this
   */
  public isVisible(visible: boolean) {
    this.visible = visible;
    return this;
  }

  /**
   * If false, will hide text in cells on very small screens (e.g. smartphone portrait mode). Default is true.
   *
   * @param textHiddenXs
   * @returns this
   */
  public isTextHiddenXs(textHiddenXs: boolean) {
    this.textHiddenXs = textHiddenXs;
    return this;
  }

  /**
   * If false, will hide text in cells on small screens (e.g. smartphone landscape mode, tablet portrait mode). Default is true.
   *
   * @param textHiddenSm
   * @returns this
   */
  public isTextHiddenSm(textHiddenSm: boolean) {
    this.textHiddenSm = textHiddenSm;
    return this;
  }

  /**
   * If false, will hide the column on small screens (e.g. smartphone landscape mode, tablet portrait mode). Default is true.
   *
   * @param hiddenSm
   * @returns this
   */
  public isHiddenSm(hiddenSm: boolean) {
    this.hiddenSm = hiddenSm;
    return this;
  }

  /**
   * If false, will hide column on very small screens (e.g. smartphone portrait mode). Default is true.
   *
   * @param hiddenXs
   * @returns this
   */
  public isHiddenXs(hiddenXs: boolean) {
    this.hiddenXs = hiddenXs;
    return this;
  }

  /**
   * Function that returns the name of the material icon that will be used.
   * @param iconNameFn
   * @returns this
   */
  public withIcon(iconNameFn: (data: T[P], dataParent: T) => string) {
    this.icon = iconNameFn;
    return this;
  }

  /**
   * OnClick enables the click listener for the table column. If any cell (excluding the header cell) is clicked, the function onClick
   * will be executed. On hover, the background of clickable cells will turn into a half-transparent gray and the cursor will become a
   * pointer. If the button property is set, onClick does not change the hover background color,
   * but rather acts as a click listener for the button.
   *
   * @param onClickFn
   * @returns this
   */
  public withOnClick(onClickFn: (data: T[P], dataParent: T) => void) {
    this.onClick = onClickFn;
    return this;
  }

  /**
   * Display a button instead of plain text/icon in your table cell.
   * The button will use the text and icon (or only the icon in case of ButtonType.ICON) that would normally be displayed directly in
   * the cell. If specified, the onClick function will be executed on a click event.
   *
   * @param buttonType
   * @returns this
   */
  public withButton(buttonType: ButtonType) {
    this.button = buttonType;
    return this;
  }

  /**
   * If the button type is set, buttonColor allows you to change the button color. Can be either 'primary', 'warn' or 'accent'.
   * If you leave the button color empty, the standard white/transparent background (depending on button type) will be used.
   *
   * @param buttonColor
   * @returns this
   */
  public withButtonColor(buttonColor: ThemePalette) {
    this.buttonColor = buttonColor;
    return this;
  }

  /**
   * Maximum lines of text in a cell. Makes simplemattable use textarea instead of span.
   *
   * @param maxLines
   * @returns this
   */
  public withMaxLines(maxLines: number) {
    this.maxLines = maxLines;
    return this;
  }

  /**
   * Minimum number of lines. maxLines needs to be specified to enable textarea support first. Default: 1
   *
   * @param minLines
   * @returns this
   */
  public withMinLines(minLines: number) {
    this.minLines = minLines;
    return this;
  }
}
