import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appLoading]',
  standalone: true
})
export class LoadingDirective {
  @Input() set appLoading(loading: boolean) {
    if (loading) {
      this.viewContainer.clear();
      this.viewContainer.createEmbeddedView(this.loadingTemplate);
    } else {
      this.viewContainer.clear();
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private loadingTemplate: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}
} 