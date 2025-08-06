import { Injectable, Provider, inject } from '@angular/core';
import { from, Observable } from 'rxjs';
import { APP_INITIALIZER } from '@angular/core';
import { AuthService } from '../../domain/auth/application/services/auth.service';

export function provideStartup(): Provider[] {
    return [
        StartupService,
        {
            provide: APP_INITIALIZER,
            useFactory: (startupService: StartupService) => () => startupService.load(),
            deps: [StartupService],
            multi: true
        }
    ];
}

@Injectable({
    providedIn: 'root'
})
export class StartupService {
    private authService = inject(AuthService);

    load(): Observable<any> {
        return from(this.authService.checkAuthStatus());
    }
}
