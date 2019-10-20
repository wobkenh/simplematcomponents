import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'smc-custom-table-cell',
  templateUrl: './custom-table-cell.component.html',
  styleUrls: ['./custom-table-cell.component.css']
})
export class CustomTableCellComponent implements OnInit {

  @Input() input;

  constructor() {
  }

  ngOnInit() {
  }

}
