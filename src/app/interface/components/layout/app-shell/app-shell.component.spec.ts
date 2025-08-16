/**
 * App Shell 組件測試
 *
 * @author NG-AC Team
 * @since 2024-12-19
 * @version 1.0.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppShellService, OfflineService } from '../../../application/services/app-shell';
import { AppShellComponent } from './app-shell.component';

describe('AppShellComponent', () => {
  let component: AppShellComponent;
  let fixture: ComponentFixture<AppShellComponent>;
  let appShellService: jasmine.SpyObj<AppShellService>;
  let offlineService: jasmine.SpyObj<OfflineService>;

  beforeEach(async () => {
    const appShellSpy = jasmine.createSpyObj('AppShellService', ['toggleTheme', 'toggleSidebar'], {
      currentTheme: () => 'light',
      sidebarOpen: () => false
    });
    const offlineSpy = jasmine.createSpyObj('OfflineService', [], {
      isOnline: () => true
    });

    await TestBed.configureTestingModule({
      imports: [
        AppShellComponent,
        RouterTestingModule
      ],
      providers: [
        { provide: AppShellService, useValue: appShellSpy },
        { provide: OfflineService, useValue: offlineSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppShellComponent);
    component = fixture.componentInstance;
    appShellService = TestBed.inject(AppShellService) as jasmine.SpyObj<AppShellService>;
    offlineService = TestBed.inject(OfflineService) as jasmine.SpyObj<OfflineService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render header, sidebar, main content and footer', () => {
    const header = fixture.nativeElement.querySelector('.app-header');
    const sidebar = fixture.nativeElement.querySelector('.app-sidebar');
    const main = fixture.nativeElement.querySelector('.app-main');
    const footer = fixture.nativeElement.querySelector('.app-footer');

    expect(header).toBeTruthy();
    expect(sidebar).toBeTruthy();
    expect(main).toBeTruthy();
    expect(footer).toBeTruthy();
  });

  it('should handle theme toggle correctly', () => {
    component.toggleTheme();
    expect(appShellService.toggleTheme).toHaveBeenCalled();
  });

  it('should handle sidebar toggle correctly', () => {
    component.toggleSidebar();
    expect(appShellService.toggleSidebar).toHaveBeenCalled();
  });
});
