import { Component, OnInit } from '@angular/core';
import { PageSettings } from 'projects/simplemattable/src/lib/model/page-settings.model';
import { TableColumn } from 'projects/simplemattable/src/public_api';
import { TestData } from '../model/test-data.model';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'smc-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {

  // Pagination
  dataPagination: TestData[] = [];
  columnsPagination: TableColumn<any, any>[] = [];
  pageSettings: PageSettings;
  paginatorLength = 101;

  constructor() { }

  ngOnInit() {
    /*
      Paginator Table
    */
    this.dataPagination = [];
    this.columnsPagination = [
      new TableColumn<TestData, 'key'>('Key', 'key'),
      new TableColumn<TestData, 'value'>('Value', 'value')
    ];
  }

  resetToPageZero() {
    this.pageSettings = {
      pageIndex: 0
    };
  }

  resetToPageSizeTen() {
    this.pageSettings = {
      pageSize: 10
    };
  }

  getPage(offset: number, limit: number): Observable<TestData[]> {
    /*
      Note that normally you would just return an observable obtained from a service method, e.g.:
      return this.myService.get(offset, limit);
    */
    console.log('Fetching page index ' + offset + ' with page size ' + limit);
    const observable = new Subject<TestData[]>();
    setTimeout(() => {
      // simulate backend request
      const data: TestData[] = [];
      // Generate entries up to the max count to simulate backend having no more data
      const limitThisPage = Math.min(limit, this.paginatorLength - (offset * limit));
      for (let i = 0; i < limitThisPage; i++) {
        data.push(new TestData('Page ' + (offset + 1), 'Entry ' + (i + 1 + (offset * limit)), null));
      }
      observable.next(data);
    }, 1000);
    return observable;
  }

}
