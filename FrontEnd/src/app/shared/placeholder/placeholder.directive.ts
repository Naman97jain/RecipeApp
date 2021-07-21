import { Directive, ViewContainerRef, Input, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appPlaceholder]'
})
export class PlaceholderDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
