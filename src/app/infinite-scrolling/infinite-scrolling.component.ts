import { Component, OnInit } from '@angular/core';
import {TableColumn} from '../../../projects/simplemattable/src/lib/model/table-column.model';
import { Observable, Subject } from 'rxjs';
import { TestData } from '../model/test-data.model';

@Component({
  selector: 'smc-infinite-scrolling',
  templateUrl: './infinite-scrolling.component.html',
  styleUrls: ['./infinite-scrolling.component.css']
})
export class InfiniteScrollingComponent implements OnInit {

  // Infinite Scroll
  dataInfiniteScroll: TestData[] = [];
  dataInfiniteScroll2: TestData[] = [];
  columnsInfiniteScroll: TableColumn<any, any>[] = [];

  constructor() { }

  ngOnInit() {

    /*
        Infinite Scroll Table
    */
   this.dataInfiniteScroll = [];
   this.dataInfiniteScroll2 = [];
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

}
