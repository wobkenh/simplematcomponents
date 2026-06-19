import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'smc-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class HomeComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

}
