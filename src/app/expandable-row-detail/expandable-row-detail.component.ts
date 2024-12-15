import { Component, OnInit } from '@angular/core';
import { DetailRowComponent } from '../../../projects/simplemattable/src/lib/model/detail-row-component';
import { ComplexTestData } from '../model/test-data.model';

@Component({
  selector: 'smc-expandable-row-detail',
  templateUrl: './expandable-row-detail.component.html',
  styleUrls: ['./expandable-row-detail.component.css'],
  standalone: false
})
export class ExpandableRowDetailComponent implements OnInit, DetailRowComponent<ComplexTestData> {

  element: ComplexTestData;

  constructor() {
  }

  ngOnInit(): void {
  }

  onInput(element: ComplexTestData): void {
    this.element = element;
  }

}
