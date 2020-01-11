/**
 * Class used internally to represent state associated with a table cell.
 * Do not use this class outside of simplemattable
 */
export class TableColumn<T, P extends keyof T> {
  tableColumn: TableColumn<T, P>;
  onChange: () => void;
}
