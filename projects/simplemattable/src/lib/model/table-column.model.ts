import { Align } from './align.model';
import { ButtonType } from './button-type.model';
import { ThemePalette } from '@angular/material/core';
import { Width } from './width.model';
import { AbstractFormField } from './abstract-form-field.model';
import { NumberFormField } from './number-form-field.model';
import { TextFormField } from './text-form-field.model';
import { DateFormField } from './date-form-field.model';
import { SelectFormField } from './select-form-field.model';
import { LargeTextFormField } from './large-text-form-field.model';
import { Height } from './height.model';
import { CheckboxFormField } from './checkbox-form-field.model';
import { Type } from '@angular/core';
import { Observable } from 'rxjs';

export class TableColumn<T, P extends keyof T> {

  public transform: (data: T[P], dataParent: T, dataList: T[]) => number | string | Observable<number | string>;
  public tooltip: (data: T[P], dataParent: T, dataList: T[]) => string;
  public headerTooltip: string;
  public width: string;
  public heightFn: (data: T[P], dataParent: T, dataList: T[]) => Height;
  public disabledFn: (data: T[P], dataParent: T, dataList: T[]) => boolean;
  public align: Align = Align.LEFT;
  public sortable: boolean = true;
  public sortTransform: (data: T[P], dataParent: T, dataList: T[]) => number | string;
  public visible: boolean = true;
  public icon: (data: T[P], dataParent: T, dataList: T[]) => string;
  public onClick: (data: T[P], dataParent: T, dataList: T[], event: MouseEvent) => void;
  public button: ButtonType;
  public buttonColor: ThemePalette;
  public onHeaderClick: (dataList: T[], event: MouseEvent) => void;
  public headerButton: ButtonType;
  public headerButtonColor: ThemePalette;
  public headerIcon: string;
  public maxLines: number;
  public minLines: number = 1;
  public textHiddenXs: boolean = false;
  public textHiddenSm: boolean = false;
  public hiddenXs: boolean = false;
  public hiddenSm: boolean = false;
  public directEdit: boolean = false;
  public ngClass: (data: T[P], dataParent: T, dataList: T[]) => string | string[] | Object;
  public footerNgClass: (data: T[P], dataParent: T[]) => string | string[] | Object;
  public ngStyle: (data: T[P], dataParent: T, dataList: T[]) => Object;
  public footerNgStyle: (data: T[P], dataParent: T[]) => Object;
  public formField: AbstractFormField<T, P, any>;
  public colFilter: boolean = false;
  public colFilterLabel: string = 'Filter';
  public sticky: boolean = false;
  public stickyEnd: boolean = false;
  public ngComponent: Type<any>;
  public ngComponentInput: (component: any, data: T[P], dataParent: T, dataList: T[]) => void;
  public footer: (data: T[P][], dataParent: T[]) => string;
  public searchFn: (searchInput: string) => void;
  public filterFn: (searchInput: string, data: T[P], dataParent: T) => boolean;

  private colFilterText: ColFilterTextHolder = {
    applied: true,
    text: ''
  };

  constructor(public name: string,
              public property: P) {
  }

  /**
   * Specify a custom filter function to overwrite the default behaviour of the column search input
   * If you only want to listen to search inputs of the user without changing the filter behaviour, use withSearch
   *
   * @param filterFn function checking if the given element matches the search string.
   *                 Should return true if element matches and should be kept
   *                 and should return false if the element does not match and should be removed
   */
  public withFilter(filterFn: (searchInput: string, data: T[P], dataParent: T) => boolean) {
    this.filterFn = filterFn;
    return this;
  }

  /**
   * Function that is called when the user enters a search query into the filter input
   * If you want to handle the search yourself, use withFilter instead.
   */
  public withSearch(searchFn: (searchInput: string) => void) {
    this.searchFn = searchFn;
    return this;
  }

  /**
   * Function that returns the display value of a cell.
   * Use a function that returns empty string if you want to have nothing displayed.
   * may return observable to retrieve an async result
   *
   * @param transformFn
   * @returns this
   */
  public withTransform(transformFn: (data: T[P], dataParent: T, dataList: T[]) => number | string | Observable<number | string>) {
    this.transform = transformFn;
    return this;
  }

  /**
   * Function that returns the tooltip value of a cell.
   * Return null or undefined if you want the tooltip to not be displayed in a specific cell.
   *
   * @param tooltipFn
   * @returns this
   */
  public withTooltip(tooltipFn: (data: T[P], dataParent: T, dataList: T[]) => string) {
    this.tooltip = tooltipFn;
    return this;
  }

  /**
   * Tooltip to be displayed if the user hovers over the header cell.
   *
   * @param headerTooltip
   * @returns this
   */
  public withHeaderTooltip(headerTooltip: string) {
    this.headerTooltip = headerTooltip;
    return this;
  }

  /**
   * Function that returns the display value of the footer cell for this column.
   * If not already active through an other column, specifying the footerFn on a column will activate the footer row.
   *
   * @param footerFn. Arguments are the values of every cell of this column.
   * @returns this
   */
  public withFooter(footerFn: (data: T[P][], dataParent: T[]) => string) {
    this.footer = footerFn;
    return this;
  }

  /**
   * Function that returns the sort value of a cell.
   * Return type has to be either number or string.
   *
   * @param transformFn
   * @returns this
   */
  public withSortTransform(transformFn: (data: T[P], dataParent: T, dataList: T[]) => number | string) {
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
    this.width = width.toString();
    return this;
  }

  /**
   * Function which calculates the height of a table cell.
   * The decision can be based on the Data of the Cell or Row.
   * The function has to return a Height object to set a pixel or percent height.
   * To not set a height, return null.
   * @param heightFn
   */
  public withHeightFn(heightFn: (data: T[P], dataParent: T, dataList: T[]) => Height) {
    this.heightFn = heightFn;
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
   * Whether the button is disabled or not.
   *
   * @param disabledFn
   * @returns this
   */
  public withButtonDisabled(disabledFn: (data: T[P], dataParent: T, dataList: T[]) => boolean) {
    this.disabledFn = disabledFn;
    return this;
  }

  /**
   * Pass true to make this column stick to the start of the table.
   * A sticky column will stay in place even when the table is too wide for the viewport.
   * The column will start sticking once it reaches the start of the table.
   * If it is supposed to stick to the end, use {@link #isStickyEnd}
   * Default is false.
   *
   * @param sticky
   * @returns this
   */
  public isSticky(sticky: boolean) {
    this.sticky = sticky;
    return this;
  }

  /**
   * Pass true to make this column stick to the start of the table.
   * A sticky column will stay in place even when the table is too wide for the viewport.
   * The column will start sticking once it reaches the start of the table.
   * If it is supposed to stick to the end, use {@link #isSticky}
   * Default is false.
   *
   * @param stickyEnd
   * @returns this
   */
  public isStickyEnd(stickyEnd: boolean) {
    this.stickyEnd = stickyEnd;
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
   * Use this if you want to show a form at all times even when edit mode is not activated
   *
   * @param directEdit
   * @returns this
   */
  public isDirectEdit(directEdit: boolean) {
    this.directEdit = directEdit;
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
  public withIcon(iconNameFn: (data: T[P], dataParent: T, dataList: T[]) => string) {
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
  public withOnClick(onClickFn: (data: T[P], dataParent: T, dataList: T[], event: MouseEvent) => void) {
    this.onClick = onClickFn;
    return this;
  }

  /**
   * OnHeaderClick enables the click listener for the table header cell.
   * Use it in conjunction with the headerButton property.
   *
   * @param onHeaderClickFn
   * @returns this
   */
  public withOnHeaderClick(onHeaderClickFn: (dataList: T[], event: MouseEvent) => void) {
    this.onHeaderClick = onHeaderClickFn;
    return this;
  }

  /**
   * Set this to a material icon to display an icon the the table header cell.
   *
   * @param headerIcon material icon name
   * @returns this
   */
  public withHeaderIcon(headerIcon: string) {
    this.headerIcon = headerIcon;
    return this;
  }

  /**
   * Display a button instead of plain text/icon in your table header cell.
   * The button will use the text and icon (or only the icon in case of ButtonType.ICON) that would normally be displayed directly in
   * the header cell. If specified, the onHeaderClick function will be executed on a click event.
   *
   * @param headerButtonType
   * @returns this
   */
  public withHeaderButton(headerButtonType: ButtonType) {
    this.headerButton = headerButtonType;
    return this;
  }

  /**
   * If the header button type is set, headerButtonColor allows you to change the header button color. Can be either 'primary', 'warn' or 'accent'.
   * If you leave the header button color empty, the standard white/transparent background (depending on button type) will be used.
   *
   * @param headerButtonColor
   * @returns this
   */
  public withHeaderButtonColor(headerButtonColor: ThemePalette) {
    this.headerButtonColor = headerButtonColor;
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

  /**
   * Function that returns something that ngClass can parse. Can be used to apply css classes to the table cells of a column.
   * See https://angular.io/api/common/NgClass for more information.
   *
   * @param ngClassFn
   * @returns this
   */
  public withNgClass(ngClassFn: (data: T[P], dataParent: T, dataList: T[]) => string | string[] | Object) {
    this.ngClass = ngClassFn;
    return this;
  }

  /**
   * Function that returns something that ngStyle can parse. Can be used to apply inline css to the table cells of a column.
   * See https://angular.io/api/common/NgStyle for more information.
   *
   * @param ngStyleFn
   * @returns this
   */
  public withNgStyle(ngStyleFn: (data: T[P], dataParent: T, dataList: T[]) => Object) {
    this.ngStyle = ngStyleFn;
    return this;
  }

  /**
   * Function that returns something that ngClass can parse. Can be used to apply css classes to the footer cell of a column.
   * See https://angular.io/api/common/NgClass for more information.
   *
   * NOTE: The Footer will only be displayed if a footer was provided with {@link #withFooter}.
   *
   * @param ngClassFn
   * @returns this
   */
  public withFooterNgClass(ngClassFn: (data: T[P], dataParent: T[]) => string | string[] | Object) {
    this.footerNgClass = ngClassFn;
    return this;
  }

  /**
   * Function that returns something that ngStyle can parse. Can be used to apply inline css to the footer cell of a column.
   * See https://angular.io/api/common/NgStyle for more information.
   *
   * NOTE: The Footer will only be displayed if a footer was provided with {@link #withFooter}.
   *
   * @param ngStyleFn
   * @returns this
   */
  public withFooterNgStyle(ngStyleFn: (data: T[P], dataParent: T[]) => Object) {
    this.footerNgStyle = ngStyleFn;
    return this;
  }

  /**
   * If ngstyle/ngclass and string transformations are not enough, you can substitute the cell content with your own component.
   * Use this method to supply the Component Type (Use the Component Name as the parameter).
   * Have a look at {@link #withNgComponentInput} to feed the component with input
   *
   * @param ngComponent Component Class
   */
  public withNgComponent(ngComponent: Type<any>) {
    this.ngComponent = ngComponent;
    return this;
  }

  /**
   * If you want to display your own angular component in the table cells and have activated this feature through {@link #withNgComponent},
   * then you can supply a function here to fill the input parameters of your component. The function will be passed the component instance
   * as well as the data / element the cell represents.
   *
   * Note: to accomplish type safety, explicitly state the type of your Component when defining this function.
   * The component instance is listed as "any" to avoid having to pass a third generic to the table column.
   *
   * @param ngComponentInput
   */
  public withNgComponentInput(ngComponentInput: (component: any, data: T[P], dataParent: T, dataList: T[]) => void) {
    this.ngComponentInput = ngComponentInput;
    return this;
  }

  /**
   * Will enable Column-Specific string search.
   */
  public withColFilter() {
    this.colFilter = true;
    return this;
  }

  /**
   * Sets the label displayed as placeholder in the column filter input.
   */
  public withColFilterLabel(label: string) {
    this.colFilterLabel = label;
    return this;
  }

  /**
   * If editing is enabled, will place a form field in the cells of this column when editing.
   *
   * @returns textFormField
   */
  public withFormField(formField: AbstractFormField<T, P, any>) {
    this.formField = formField;
    return this;
  }

  /**
   * Returns a new NumberFormField using the generic parameters of this column.
   *
   * @returns NumberFormField
   */
  public getNumberFormField(): NumberFormField<T, P> {
    return new NumberFormField<T, P>();
  }

  /**
   * Returns a new DateFormField using the generic parameters of this column.
   *
   * @returns DateFormField
   */
  public getDateFormField(): DateFormField<T, P> {
    return new DateFormField<T, P>();
  }

  /**
   * Returns a new TextFormField using the generic parameters of this column.
   *
   * @returns TextFormField
   */
  public getTextFormField(): TextFormField<T, P> {
    return new TextFormField<T, P>();
  }

  /**
   * Returns a new SelectFormField using the generic parameters of this column.
   * The type parameter F will be the type of the form field's value.
   *
   * @returns SelectFormField
   */
  public getSelectFormField<F>(): SelectFormField<T, P, F> {
    return new SelectFormField<T, P, F>();
  }

  /**
   * Returns a new LargeTextFormField (textarea) using the generic parameters of this column.
   *
   * @returns SelectFormField
   */
  public getLargeTextFormField(): LargeTextFormField<T, P> {
    return new LargeTextFormField<T, P>();
  }

  /**
   * Returns a new CheckboxFormField (checkbox) using the generic parameters of this column.
   * Note that hints/placeholders/errors do not work on chechbox form fields.
   *
   * @returns CheckboxFormField
   */
  public getCheckboxFormField(): CheckboxFormField<T, P> {
    return new CheckboxFormField<T, P>();
  }

  /**
   * If {@link #withColFilter} is active, set the value of the col filter
   */
  public setColFilterText(text: string) {
    if (!this.colFilter) {
      return;
    }
    this.colFilterText = {
      text: text,
      applied: false
    };
  }

  /**
   * Returns the current col filter text.
   * @return ColFilterTextHolder object with information about text and
   *      if the text has been applied to the col filter
   */
  public getColFilterText(): ColFilterTextHolder {
    return this.colFilterText;
  }


}

interface ColFilterTextHolder {
  text: string;
  applied: boolean;
}
