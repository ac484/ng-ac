import { ChangeDetectionStrategy, Component, Input, booleanAttribute, inject, DOCUMENT } from '@angular/core';
import { ALAIN_I18N_TOKEN, I18nPipe, SettingsService } from '@delon/theme';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';

import { I18NService } from '../../../../infrastructure/services/i18n.service';

/**
 * Interface Component: Header I18n Widget
 *
 * Widget component that provides internationalization functionality.
 * This component belongs to the Interface layer as it handles user interaction
 * and UI concerns related to language selection and internationalization.
 */
@Component({
  selector: 'header-i18n',
  template: `
    @if (showLangText) {
      <div nz-dropdown [nzDropdownMenu]="langMenu" nzPlacement="bottomRight">
        <i nz-icon nzType="global"></i>
        {{ 'menu.lang' | i18n }}
        <i nz-icon nzType="down"></i>
      </div>
    } @else {
      <i nz-dropdown [nzDropdownMenu]="langMenu" nzPlacement="bottomRight" nz-icon nzType="global"></i>
    }
    <nz-dropdown-menu #langMenu="nzDropdownMenu">
      <ul nz-menu>
        @for (item of langs; track $index) {
          <li nz-menu-item [nzSelected]="item.code === curLangCode" (click)="change(item.code)">
            <span role="img" [attr.aria-label]="item.text" class="pr-xs">{{ item.abbr }}</span>
            {{ item.text }}
          </li>
        }
      </ul>
    </nz-dropdown-menu>
  `,
  host: {
    '[class.flex-1]': 'true'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [I18nPipe, NzDropDownModule, NzIconModule, NzMenuModule],
  standalone: true
})
export class HeaderI18nComponent {
  private readonly settings = inject(SettingsService);
  private readonly i18n = inject<I18NService>(ALAIN_I18N_TOKEN);
  private readonly doc = inject(DOCUMENT);

  /** Whether to display language text */
  @Input({ transform: booleanAttribute }) showLangText = true;

  get langs(): Array<{ code: string; text: string; abbr: string }> {
    return this.i18n.getLangs();
  }

  get curLangCode(): string {
    return this.settings.layout.lang;
  }

  /**
   * Change application language
   * Loads language data and updates application settings
   */
  change(lang: string): void {
    const spinEl = this.doc.createElement('div');
    spinEl.setAttribute('class', `page-loading ant-spin ant-spin-lg ant-spin-spinning`);
    spinEl.innerHTML = `<span class="ant-spin-dot ant-spin-dot-spin"><i></i><i></i><i></i><i></i></span>`;
    this.doc.body.appendChild(spinEl);

    this.i18n.loadLangData(lang).subscribe(res => {
      this.i18n.use(lang, res);
      this.settings.setLayout('lang', lang);
      setTimeout(() => this.doc.location.reload());
    });
  }
}
