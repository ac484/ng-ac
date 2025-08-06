import { Injectable, inject } from '@angular/core';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { SettingsService } from '@delon/theme';
import { ACLService } from '@delon/acl';
import { MenuService } from '@delon/theme';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private auth: Auth = inject(Auth);
    private settingsService = inject(SettingsService);
    private aclService = inject(ACLService);
    private menuService = inject(MenuService);

    checkAuthStatus(): Promise<void> {
        return new Promise((resolve) => {
            onAuthStateChanged(this.auth, (user) => {
                if (user) {
                    // User is signed in, see docs for a list of available properties
                    // https://firebase.google.com/docs/reference/js/auth.user
                    this.settingsService.setUser({
                        name: user.displayName,
                        avatar: user.photoURL,
                        email: user.email,
                        uid: user.uid
                    });
                    this.aclService.setFull(true);
                    this.menuService.add([
                        {
                            text: 'Main',
                            group: true,
                            children: [
                                {
                                    text: 'Dashboard',
                                    link: '/dashboard',
                                    icon: { type: 'icon', value: 'appstore' }
                                },
                                {
                                    text: 'Users',
                                    link: '/users',
                                    icon: { type: 'icon', value: 'team' }
                                }
                            ]
                        }
                    ]);
                } else {
                    // User is signed out
                    this.settingsService.setUser(null);
                }
                resolve();
            });
        });
    }
}
