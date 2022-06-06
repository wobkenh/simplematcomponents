import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {AlertType, AlertTypeString} from './alert-type.model';

@Component({
  selector: 'smc-simplealert',
  templateUrl: './simplealert.component.html',
  styleUrls: ['./simplealert.component.css'],
  animations: [
    trigger('info-slide-in', [
      state('true', style({display: 'block', opacity: 1, height: '*'})),
      state('false', style({opacity: 0, height: 0, padding: 0, overflow: 'hidden'})),
      transition('false => true', [
        animate('700ms ease')
      ]),
      transition('true => false', [
        animate('700ms ease-in'),
      ]),
    ]),
  ]
})
export class SimplealertComponent implements OnInit {

  isOpenState = false;
  @Input() type: (AlertType | AlertTypeString);
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

  getAlertType(): AlertTypeString {
    if (typeof this.type === 'string') {
      return this.type;
    } else {
      switch (this.type) {
        case AlertType.ERROR:
          return 'error';
        case AlertType.INFO:
          return 'info';
        case AlertType.SUCCESS:
          return 'success';
        case AlertType.WARN:
          return 'warn';
      }
    }
  }

}
