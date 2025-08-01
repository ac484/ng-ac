import { TestBed } from '@angular/core/testing';
import { Auth } from '@angular/fire/auth';
import { FirebaseAuthAdapterService } from './firebase-auth-adapter.service';

describe('FirebaseAuthAdapterService', () => {
  let service: FirebaseAuthAdapterService;
  let mockAuth: jasmine.SpyObj<Auth>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('Auth', ['signInWithEmailAndPassword', 'signOut']);

    TestBed.configureTestingModule({
      providers: [
        { provide: Auth, useValue: authSpy }
      ]
    });
    
    service = TestBed.inject(FirebaseAuthAdapterService);
    mockAuth = TestBed.inject(Auth) as jasmine.SpyObj<Auth>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have authState$ observable', () => {
    expect(service.authState$).toBeDefined();
  });

  it('should have isAuthenticated$ observable', () => {
    expect(service.isAuthenticated$).toBeDefined();
  });
});