import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthApplicationService } from '../../application/services/auth-application.service';

@Directive({
  selector: '[appPermission]',
  standalone: true
})
export class PermissionDirective implements OnInit, OnDestroy {
  @Input() appPermission!: string;
  private subscription?: Subscription;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthApplicationService
  ) {}

  ngOnInit() {
    this.checkPermission();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private checkPermission() {
    this.subscription = this.authService.getUserPermissions().subscribe(permissions => {
      const hasPermission = permissions.includes(this.appPermission);

      if (hasPermission) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    });
  }
}
