/**
 * @ai-context {
 *   "role": "Interface/Component",
 *   "purpose": "根組件-應用程式主要入口",
 *   "constraints": ["Standalone組件", "現代化路由", "極簡設計"],
 *   "dependencies": ["RouterOutlet", "MatSidenavModule"],
 *   "security": "low",
 *   "lastmod": "2025-08-19"
 * }
 * @usage <app-root></app-root>
 * @see docs/architecture/components.md
 */
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <router-outlet></router-outlet>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }
  `]
})
export class AppComponent {
  title = 'Project & Contract Demo';
}
