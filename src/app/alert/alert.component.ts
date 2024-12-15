import { Component, OnInit } from '@angular/core';
import { AlertType } from 'projects/simplealert/src/public_api';

@Component({
  selector: 'smc-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
  standalone: false
})
export class AlertComponent implements OnInit {

  isInfoOpen = true;
  isErrorOpen = true;
  isWarnOpen = true;
  isSuccessOpen = true;
  alertType = AlertType;

  openInfo() {
    this.isInfoOpen = true;
  }

  openError() {
    this.isErrorOpen = true;
  }

  openWarn() {
    this.isWarnOpen = true;
  }

  openSuccess() {
    this.isSuccessOpen = true;
  }

  constructor() {
  }

  ngOnInit() {
  }

}
