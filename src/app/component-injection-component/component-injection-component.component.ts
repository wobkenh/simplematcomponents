import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'smc-component-injection-component',
  templateUrl: './component-injection-component.component.html',
  styleUrls: ['./component-injection-component.component.css']
})
export class ComponentInjectionComponentComponent implements OnInit {

  @Input() input = 'default';

  constructor() {
  }

  ngOnInit() {
  }

}
