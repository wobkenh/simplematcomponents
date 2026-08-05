import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SmcBreakpointService {

  public xs$: Observable<boolean>;
  public sm$: Observable<boolean>;

  constructor(
    private breakpointObserver: BreakpointObserver,
  ) {
    // Shared so that each media query has a single listener, no matter how many cells subscribe.
    // refCount stays false: the service is root-provided and the breakpoints are needed for the
    // whole app lifetime, so tearing the upstream subscription down and up again is pure overhead.
    this.xs$ = this.breakpointObserver.observe(Breakpoints.XSmall).pipe(
      map(result => result.matches),
      shareReplay({ bufferSize: 1, refCount: false }),
    );
    this.sm$ = this.breakpointObserver.observe(Breakpoints.Small).pipe(
      map(result => result.matches),
      shareReplay({ bufferSize: 1, refCount: false }),
    );
  }
}
