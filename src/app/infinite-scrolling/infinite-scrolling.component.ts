import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TableColumn } from '../../../projects/simplemattable/src/lib/model/table-column.model';
import { Observable, Subject } from 'rxjs';
import { TestData } from '../model/test-data.model';
import { PageSettings } from '../../../projects/simplemattable/src/lib/model/page-settings.model';
import { SimplemattableComponent } from '../../../projects/simplemattable/src/lib/simplemattable/simplemattable.component';

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
  itemCount3 = 0;

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

  typescriptData3 = `this.dataInfiniteScroll3 = [];`;
  typescriptColumns3 = `this.columnsInfiniteScroll = [
  new TableColumn<TestData, 'key'>('Key', 'key'),
  new TableColumn<TestData, 'value'>('Value', 'value')
];`;
  html3 = `<div style="padding: 8px">
  <button mat-raised-button (click)="resetData()" style="margin-right: 16px">
    Reset data (e.g. after user clicked 'search')
  </button>
  <button mat-raised-button (click)="scrollToElement(15)" style="margin-right: 16px">
    Scroll to Element No. 16 (Index = 15)
  </button>
  <button mat-raised-button (click)="updateElement()">Update element at index 1</button>
</div>
<smc-simplemattable #smtInfiniteScrolling [data]="dataInfiniteScroll3" [columns]="columnsInfiniteScroll"
                    [infiniteScrolling]="true"
                    [filter]="true" (renderedData)="updateCount3($event)"
                    [sticky]="true" [getPage]="getPage" [pageSettings]="pageSettings"
                    style="height: 400px; background: white"></smc-simplemattable>
<mat-divider></mat-divider>
<div style="display: flex; align-items: center; justify-content: flex-end; padding: 20px 20px 10px 20px">
  Showing {{itemCount3}} entries
</div>`;

  pageSettings: PageSettings;
  typescriptReset = `
  @ViewChild('smtInfiniteScrolling')
  simpleMatTable: SimplemattableComponent<any>;

  scrollToElement(index: number) {
    this.simpleMatTable.scrollToIndex = index;
  }

  resetData() {
    this.pageSettings = {
      pageIndex: 0, // will reset and clear all data
    };
    // reloading the data will trigger a rendered data update, which will in turn call the above updateCount method
    // since the child element (simplemattable) is therefore updating the parent (itemCount variable)
    // we need to / can add an extra change detection cycle
    // to avoid "expression changed after it has been checked" error:
    this.changeDetectorRef.detectChanges();
  }`;
  typescriptUpdate = `updateCount3(data: TestData[]) {
  this.itemCount3 = data.length;
}`;
  typescriptUpdate2 = `updateElement() {
    this.dataInfiniteScroll3[1].value = 'updated ' + Math.random();
    this.dataInfiniteScroll3 = this.dataInfiniteScroll3.slice(0);
}`;
  @ViewChild('smtInfiniteScrolling')
  simpleMatTable: SimplemattableComponent<any>;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
  ) {
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
      pageIndex: 0, // will reset and clear all data
    };
    // reloading the data will trigger a rendered data update, which will in turn call the above updateCount method
    // since the child element (simplemattable) is therefore updating the parent (itemCount variable)
    // we need to / can add an extra change detection cycle
    // to avoid "expression changed after it has been checked" error:
    this.changeDetectorRef.detectChanges();
  }

  scrollToElement(index: number) {
    this.simpleMatTable.scrollToIndex = index;
  }

  updateCount3(data: TestData[]) {
    this.itemCount3 = data.length;
  }

  updateElement() {
    this.dataInfiniteScroll3[1].value = 'updated ' + Math.random();
    this.dataInfiniteScroll3 = this.dataInfiniteScroll3.slice(0);
  }
}
