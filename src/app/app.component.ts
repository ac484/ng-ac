import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
    selector: 'app-root',
    template: `
    <router-outlet />
  `,
    imports: [RouterOutlet, CommonModule, NzSpinModule],
    standalone: true
})
export class AppComponent {
}
