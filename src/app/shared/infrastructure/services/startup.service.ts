import { HttpClient } from '@angular/common/http';
import { EnvironmentProviders, Injectable, Provider, inject, provideAppInitializer } from '@angular/core';
import { ACLService } from '@delon/acl';
import { MenuService, SettingsService, TitleService } from '@delon/theme';

/**
 * Used for application startup
 * Generally used to get the basic data of the application, like: Menu Data, User Data, etc.
 */
export function provideStartup(): Array<Provider | EnvironmentProviders> {
    return [
        StartupService,
        provideAppInitializer(() => {
            const initializerFn = ((startupService: StartupService) => () => startupService.load())(inject(StartupService));
            return initializerFn();
        })
    ];
}

@Injectable()
export class StartupService {
    private httpClient = inject(HttpClient);
    private settingService = inject(SettingsService);
    private menuService = inject(MenuService);
    private titleService = inject(TitleService);
    private aclService = inject(ACLService);

    load(): Promise<void> {
        // This service now only loads application data.
        // Auth state is handled centrally in app.component.
        return new Promise(resolve => {
            this.httpClient.get('./assets/tmp/app-data.json').subscribe({
                next: (appData: any) => {
                    this.settingService.setApp(appData.app);
                    this.menuService.add(appData.menu);
                    this.titleService.suffix = appData.app.name;
                    resolve();
                },
                error: () => resolve() // Resolve even if app-data fails
            });
        });
    }
}
