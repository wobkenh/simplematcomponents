import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SmcBreakpointService {

  public xs$: Observable<boolean>;
  public sm$: Observable<boolean>;

  constructor(
    private breakpointObserver: BreakpointObserver,
  ) {
    this.xs$ = this.breakpointObserver.observe(Breakpoints.XSmall).pipe(
      map(result => result.matches),
    );
    this.sm$ = this.breakpointObserver.observe(Breakpoints.Small).pipe(
      map(result => result.matches),
    );
  }
}
