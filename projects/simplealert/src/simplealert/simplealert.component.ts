import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {AlertType} from './alert-type.model';

@Component({
  selector: 'smc-simplealert',
  templateUrl: './simplealert.component.html',
  styleUrls: ['./simplealert.component.css'],
  animations: [
    trigger('info-slide-in', [
      state('true', style({display: 'block', opacity: 1, height: '*'})),
      state('false', style({display: 'none', opacity: 0, height: 0})),
      transition('false => true', [
        animate('700ms ease-out')
      ]),
      transition('true => false', [
        animate('700ms ease-in'),
      ]),
    ]),
  ]
})
export class SimplealertComponent implements OnInit {

  isOpenState = false;
  @Input() type: AlertType;

  @Output() isOpenChange = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  @Input()
  get isOpen() {
    return this.isOpenState;
  }

  set isOpen(isOpen: boolean) {
    this.isOpenState = isOpen;
    this.isOpenChange.emit(this.isOpenState);
  }

}
