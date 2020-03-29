import {Component, OnInit} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map, shareReplay} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'smc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  simpleMatTableItems = [
    {
      link: '/simple',
      text: 'Simple'
    }, {
      link: '/transform',
      text: 'Transform'
    }, {
      link: '/width-height',
      text: 'Width and Height'
    }, {
      link: '/align',
      text: 'Align'
    }, {
      link: '/sortable',
      text: 'Sortable'
    }, {
      link: '/visibility',
      text: 'Visibility/Responsive'
    }, {
      link: '/icons-buttons',
      text: 'Icons and Buttons'
    }, {
      link: '/multiline',
      text: 'Multiline'
    }, {
      link: '/drag-drop-columns',
      text: 'Drag and drop columns'
    }, {
      link: '/custom-css',
      text: 'Custom CSS'
    }, {
      link: '/filter',
      text: 'Filter'
    }, {
      link: '/forms',
      text: 'Forms'
    }, {
      link: '/scrollable',
      text: 'Scrollable'
    }, {
      link: '/sticky-columns',
      text: 'Sticky Columns'
    }, {
      link: '/pagination',
      text: 'Pagination'
    }, {
      link: '/direct-edit',
      text: 'Direct Edit'
    }, {
      link: '/infinite-scroll',
      text: 'Infinite Scrolling'
    }, {
      link: '/custom-components',
      text: 'Custom Components'
    }, {
      link: '/internationalization',
      text: 'Internationalization'
    }
  ];

  constructor(
    private breakpointObserver: BreakpointObserver,
  ) {
  }

  ngOnInit(): void {
  }

}
