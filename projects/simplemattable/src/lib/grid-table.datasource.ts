/**
 * Data source
 */
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable} from 'rxjs';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';

export class GridTableDatasource<T> extends DataSource<T> {
  private _data: any[];
  offset = 0;
  offsetChange = new BehaviorSubject(0);
  private readonly visibleData: BehaviorSubject<any[]> = new BehaviorSubject(
    []
  );


  constructor(
    initialData: any[],
    private viewport: CdkVirtualScrollViewport,
    private itemSize: number,
    private pageSize: number,
  ) {
    super();
    this._data = initialData;
    this.viewport.elementScrolled().subscribe((ev: any) => {
      // debugger;
      const start = Math.floor(ev.currentTarget.scrollTop / this.itemSize);
      const prevExtraData = start > 5 ? 5 : 0;
      // const prevExtraData = 0;
      const startIndex = start - prevExtraData;
      const endIndex = start + (this.pageSize - prevExtraData);
      const slicedData = this._data.slice(
        startIndex,
        endIndex
      );
      this.offset = this.itemSize * startIndex;
      this.viewport.setRenderedContentOffset(this.offset);
      this.offsetChange.next(this.offset);
      this.visibleData.next(slicedData);
    });
  }


  get data(): any[] {
    return this._data.slice();
  }

  set data(data: any[]) {
    this._data = data;
    this.viewport.scrollToOffset(0);
    this.viewport.setTotalContentSize(this.itemSize * (data.length + 5)); // + 1 for header, + 4 for buffer at the end for easier scrolling
    this.visibleData.next(this._data.slice(0, this.pageSize));
  }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<any[] | ReadonlyArray<any>> {
    return this.visibleData;
  }

  disconnect(collectionViewer: CollectionViewer): void {
  }

}
