import { Component, OnInit } from '@angular/core';
import { TableColumn } from '../../../projects/simplemattable/src/lib/model/table-column.model';
import { Observable, Subject } from 'rxjs';
import { TestData } from '../model/test-data.model';
import { PageSettings } from '../../../projects/simplemattable/src/lib/model/page-settings.model';

@Component({
  selector: 'smc-infinite-scrolling',
  templateUrl: './infinite-scrolling.component.html',
  styleUrls: ['./infinite-scrolling.component.css']
})
export class InfiniteScrollingComponent implements OnInit {

  // Infinite Scroll
  dataInfiniteScroll: TestData[] = [];
  dataInfiniteScroll2: TestData[] = [];
  dataInfiniteScroll3: TestData[] = [];
  columnsInfiniteScroll: TableColumn<any, any>[] = [];
  itemCount = 0;

  typescriptData = `this.dataInfiniteScroll = [];`;
  typescriptColumns = `this.columnsInfiniteScroll = [
  new TableColumn<TestData, 'key'>('Key', 'key'),
  new TableColumn<TestData, 'value'>('Value', 'value')
];`;
  html = `<smc-simplemattable [data]="dataInfiniteScroll" [columns]="columnsInfiniteScroll" [infiniteScrolling]="true"
                    [filter]="true" (renderedData)="updateCount($event)"
                    [sticky]="true" [getPage]="getPage"
                    style="height: 400px; background: white"></smc-simplemattable>
          <mat-divider></mat-divider>
          <div style="display: flex; align-items: center; justify-content: flex-end; padding: 20px 20px 10px 20px">
            Showing {{itemCount}} entries
          </div>`;

  typescriptData2 = `this.dataInfiniteScroll2 = [];`;
  typescriptColumns2 = `this.columnsInfiniteScroll = [
 new TableColumn<TestData, 'key'>('Key', 'key'),
 new TableColumn<TestData, 'value'>('Value', 'value')
];`;
  typescriptGetPage = `getPage(offset: number, limit: number): Observable<TestData[]> {
  console.log('Fetching page index ' + offset + ' with page size ' + limit);
  const observable = new Subject<TestData[]>();
  setTimeout(() => {
    // simulate backend request
    const data: TestData[] = [];
    // Generate entries up to the max count to simulate backend having no more data
    // Simulated backend item count of 105
    const limitThisPage = Math.min(limit, 105 - (offset * limit));
    for (let i = 0; i < limitThisPage; i++) {
      data.push(new TestData('Page ' + (offset + 1), 'Entry ' + (i + 1 + (offset * limit)), null));
    }
    observable.next(data);
  }, 1000);
  return observable;
}`;
  html2 = `<smc-simplemattable [data]="dataInfiniteScroll2" [columns]="columnsInfiniteScroll" [infiniteScrolling]="true"
                  [getPage]="getPage"></smc-simplemattable>`;
  pageSettings: PageSettings;

  constructor() {
  }

  ngOnInit() {

    /*
        Infinite Scroll Table
    */
    this.dataInfiniteScroll = [];
    this.dataInfiniteScroll2 = [];
    this.dataInfiniteScroll3 = [];
    this.columnsInfiniteScroll = [
      new TableColumn<TestData, 'key'>('Key', 'key'),
      new TableColumn<TestData, 'value'>('Value', 'value')
    ];
  }

  getPage(offset: number, limit: number): Observable<TestData[]> {
    console.log('Fetching page index ' + offset + ' with page size ' + limit);
    const observable = new Subject<TestData[]>();
    setTimeout(() => {
      // simulate backend request
      const data: TestData[] = [];
      // Generate entries up to the max count to simulate backend having no more data
      // Simulated backend item count of 105
      const limitThisPage = Math.min(limit, 105 - (offset * limit));
      for (let i = 0; i < limitThisPage; i++) {
        data.push(new TestData('Page ' + (offset + 1), 'Entry ' + (i + 1 + (offset * limit)), null));
      }
      observable.next(data);
    }, 1000);
    return observable;
  }

  updateCount(data: TestData[]) {
    this.itemCount = data.length;
  }

  resetData() {
    this.pageSettings = {
      pageIndex: 0,
    };
  }
}
