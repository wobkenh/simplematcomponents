import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'smc-custom-table-cell',
  templateUrl: './custom-table-cell.component.html',
  styleUrls: ['./custom-table-cell.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class CustomTableCellComponent implements OnInit {

  @Input() input;

  constructor() {
  }

  ngOnInit() {
  }

}
