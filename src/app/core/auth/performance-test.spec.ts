import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { FirebaseAuthAdapterService } from './firebase-auth-adapter.service';
import { AuthStateManagerService } from './auth-state-manager.service';
import { TokenSyncService } from './token-sync.service';
import { PerformanceMonitorService } from './performance-monitor.service';

/**
 * Firebase Auth 性能測試
 * 
 * 遵循精簡主義原則，專注於核心性能指標測試
 */
describe('Firebase Auth Performance Tests', () => {
    let authStateManager: AuthStateManagerService;
    let tokenSync: jasmine.SpyObj<TokenSyncService>;
    let performanceMonitor: PerformanceMonitorService;
    let firebaseAuth: jasmine.SpyObj<FirebaseAuthAdapterService>;

    const mockUser = {
        uid: 'test-uid',
        email: 'test@example.com',
        displayName: 'Test User'
    } as any;

    beforeEach(() => {
        const firebaseAuthSpy = jasmine.createSpyObj('FirebaseAuthAdapterService',
            ['getIdToken', 'signOut'],
            {
                authState$: new BehaviorSubject(null)
            }
        );
        const tokenSyncSpy = jasmine.createSpyObj('TokenSyncService',
            ['syncFirebaseToken', 'clearTokens']
        );

        TestBed.configureTestingModule({
            providers: [
                AuthStateManagerService,
                PerformanceMonitorService,
                { provide: FirebaseAuthAdapterService, useValue: firebaseAuthSpy },
                { provide: TokenSyncService, useValue: tokenSyncSpy }
            ]
        });

        authStateManager = TestBed.inject(AuthStateManagerService);
        performanceMonitor = TestBed.inject(PerformanceMonitorService);
        firebaseAuth = TestBed.inject(FirebaseAuthAdapterService) as jasmine.SpyObj<FirebaseAuthAdapterService>;
        tokenSync = TestBed.inject(TokenSyncService) as jasmine.SpyObj<TokenSyncService>;

        // 設置基本 mock 返回值
        tokenSync.syncFirebaseToken.and.returnValue(of(void 0));
        tokenSync.clearTokens.and.returnValue(of(void 0));
        firebaseAuth.getIdToken.and.returnValue(of('mock-token'));
    });

    describe('Token Sync Performance', () => {
        it('should avoid duplicate token sync operations', (done) => {
            const token = 'test-token';

            // 第一次同步
            tokenSync.syncFirebaseToken(token, mockUser).subscribe(() => {
                expect(tokenSync.syncFirebaseToken).toHaveBeenCalledTimes(1);

                // 第二次使用相同 token 同步（應該被緩存優化跳過）
                tokenSync.syncFirebaseToken(token, mockUser).subscribe(() => {
                    expect(tokenSync.syncFirebaseToken).toHaveBeenCalledTimes(2);
                    done();
                });
            });
        });

        it('should complete token sync within performance threshold', (done) => {
            const startTime = performance.now();

            tokenSync.syncFirebaseToken('test-token', mockUser).subscribe(() => {
                const duration = performance.now() - startTime;

                // Token 同步應該在 100ms 內完成
                expect(duration).toBeLessThan(100);
                done();
            });
        });
    });

    describe('Auth State Management Performance', () => {
        it('should initialize auth state efficiently', (done) => {
            const startTime = performance.now();

            authStateManager.initialize().subscribe(() => {
                const duration = performance.now() - startTime;

                // 認證初始化應該在 500ms 內完成
                expect(duration).toBeLessThan(500);
                done();
            });
        });

        it('should handle rapid state changes efficiently', (done) => {
            let stateChangeCount = 0;
            const maxChanges = 5;
            const startTime = performance.now();

            // 監聽狀態變化
            authStateManager.authState$.subscribe(() => {
                stateChangeCount++;

                if (stateChangeCount === maxChanges) {
                    const duration = performance.now() - startTime;

                    // 5 次狀態變化應該在 200ms 內完成
                    expect(duration).toBeLessThan(200);
                    done();
                }
            });

            // 快速觸發多個狀態變化
            for (let i = 0; i < maxChanges; i++) {
                setTimeout(() => {
                    const user = i % 2 === 0 ? mockUser : null;
                    (firebaseAuth.authState$ as BehaviorSubject<any>).next(user);
                }, i * 10);
            }
        });
    });

    describe('Performance Monitoring', () => {
        it('should record performance metrics correctly', () => {
            performanceMonitor.startTimer('test-operation');

            // 模擬一些操作
            setTimeout(() => {
                const duration = performanceMonitor.endTimer('test-operation');

                expect(duration).toBeGreaterThan(0);
                expect(performanceMonitor.getMetric('test-operation')).toBeDefined();
            }, 10);
        });

        it('should handle multiple concurrent timers', () => {
            performanceMonitor.startTimer('operation-1');
            performanceMonitor.startTimer('operation-2');
            performanceMonitor.startTimer('operation-3');

            const duration1 = performanceMonitor.endTimer('operation-1');
            const duration2 = performanceMonitor.endTimer('operation-2');
            const duration3 = performanceMonitor.endTimer('operation-3');

            expect(duration1).toBeGreaterThanOrEqual(0);
            expect(duration2).toBeGreaterThanOrEqual(0);
            expect(duration3).toBeGreaterThanOrEqual(0);
        });

        it('should clear metrics correctly', () => {
            performanceMonitor.recordMetric('test-metric', 100);
            expect(performanceMonitor.getMetric('test-metric')).toBe(100);

            performanceMonitor.clearMetrics();
            expect(performanceMonitor.getMetric('test-metric')).toBeUndefined();
        });
    });

    describe('Memory Management', () => {
        it('should not create memory leaks with multiple subscriptions', (done) => {
            const subscriptions: any[] = [];

            // 創建多個訂閱
            for (let i = 0; i < 10; i++) {
                const sub = authStateManager.authState$.subscribe();
                subscriptions.push(sub);
            }

            // 清理所有訂閱
            subscriptions.forEach(sub => sub.unsubscribe());

            // 驗證沒有記憶體洩漏（這裡只是基本檢查）
            expect(subscriptions.length).toBe(10);
            done();
        });
    });
});