export interface DetailRowComponent<T> {
  onInput: (element: T, dataList: T[]) => void;
}
