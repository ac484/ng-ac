import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDoc, getDocs, setDoc, deleteDoc, query, where, orderBy, DocumentData } from '@angular/fire/firestore';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { Email } from '../../domain/value-objects/authentication/email.value-object';
import { DisplayName } from '../../domain/value-objects/authentication/display-name.value-object';
import { PhotoUrl } from '../../domain/value-objects/authentication/photo-url.value-object';
import { UserId } from '../../domain/value-objects/authentication/user-id.value-object';
import { UserStatus, UserStatusType } from '../../domain/value-objects/status/user-status.value-object';
import { IsAnonymous } from '../../domain/value-objects/status/is-anonymous.value-object';
import { IsEmailVerified } from '../../domain/value-objects/status/is-email-verified.value-object';
import { AuthProvider, AuthProviderType } from '../../domain/value-objects/authentication/auth-provider.value-object';
import { AuthMethod, AuthMethodType } from '../../domain/value-objects/authentication/auth-method.value-object';
import { SessionId } from '../../domain/value-objects/authentication/session-id.value-object';
import { RoleSet } from '../../domain/value-objects/authorization/role-set.value-object';
import { PermissionSet } from '../../domain/value-objects/authorization/permission-set.value-object';
import { DeviceInfo } from '../../domain/value-objects/device/device-info.value-object';
import { GeoLocation } from '../../domain/value-objects/device/geo-location.value-object';
import { LoginSource } from '../../domain/value-objects/device/login-source.value-object';
import { LoginContext } from '../../domain/value-objects/device/login-context.value-object';
import { JWTToken } from '../../domain/value-objects/token/jwt-token.value-object';
import { TokenExpiresAt } from '../../domain/value-objects/token/token-expires-at.value-object';

/**
 * Firebase implementation of UserRepository
 * Uses @angular/fire for all Firebase operations
 */
@Injectable({
  providedIn: 'root'
})
export class FirebaseUserRepository implements UserRepository {

  private readonly collectionName = 'users';

  constructor(private firestore: Firestore) {}

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    try {
      const userDoc = doc(this.firestore, this.collectionName, id);
      const userSnapshot = await getDoc(userDoc);
      
      if (userSnapshot.exists()) {
        return this.mapFromFirestore(userSnapshot.data(), userSnapshot.id);
      }
      
      return null;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw new Error('Failed to find user by ID');
    }
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    try {
      const usersRef = collection(this.firestore, this.collectionName);
      const q = query(usersRef, where('email', '==', email.toLowerCase()));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return this.mapFromFirestore(doc.data(), doc.id);
      }
      
      return null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw new Error('Failed to find user by email');
    }
  }

  /**
   * Find all users with optional status filtering
   */
  async findAll(status?: string): Promise<User[]> {
    try {
      const usersRef = collection(this.firestore, this.collectionName);
      let q = query(usersRef, orderBy('createdAt', 'desc'));
      
      if (status) {
        q = query(usersRef, where('status', '==', status), orderBy('createdAt', 'desc'));
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => this.mapFromFirestore(doc.data(), doc.id));
    } catch (error) {
      console.error('Error finding all users:', error);
      throw new Error('Failed to find all users');
    }
  }

  /**
   * Save user (create or update)
   */
  async save(user: User): Promise<void> {
    try {
      const userDoc = doc(this.firestore, this.collectionName, user.id);
      const userData = this.mapToFirestore(user);
      await setDoc(userDoc, userData, { merge: true });
    } catch (error) {
      console.error('Error saving user:', error);
      throw new Error('Failed to save user');
    }
  }

  /**
   * Delete user by ID
   */
  async delete(id: string): Promise<void> {
    try {
      const userDoc = doc(this.firestore, this.collectionName, id);
      await deleteDoc(userDoc);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user');
    }
  }

  /**
   * Check if user exists by email
   */
  async existsByEmail(email: string): Promise<boolean> {
    try {
      const user = await this.findByEmail(email);
      return user !== null;
    } catch (error) {
      console.error('Error checking user existence:', error);
      throw new Error('Failed to check user existence');
    }
  }

  /**
   * Count total users
   */
  async count(): Promise<number> {
    try {
      const usersRef = collection(this.firestore, this.collectionName);
      const querySnapshot = await getDocs(usersRef);
      return querySnapshot.size;
    } catch (error) {
      console.error('Error counting users:', error);
      throw new Error('Failed to count users');
    }
  }

  /**
   * Find users by status
   */
  async findByStatus(status: string): Promise<User[]> {
    try {
      const usersRef = collection(this.firestore, this.collectionName);
      const q = query(usersRef, where('status', '==', status), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => this.mapFromFirestore(doc.data(), doc.id));
    } catch (error) {
      console.error('Error finding users by status:', error);
      throw new Error('Failed to find users by status');
    }
  }

  /**
   * Map Firestore document to User entity
   */
  private mapFromFirestore(data: DocumentData, id: string): User {
    // 創建值物件
    const email = new Email(data['email']);
    const displayName = new DisplayName(data['displayName']);
    const photoUrl = new PhotoUrl(data['photoURL']);
    const userId = new UserId(id);
    const status = new UserStatus(data['status'] as UserStatusType);
    const isAnonymous = new IsAnonymous(data['isAnonymous'] || false);
    const isEmailVerified = new IsEmailVerified(data['isEmailVerified'] || false);
    const authProvider = new AuthProvider(data['authProvider'] as AuthProviderType);
    const authMethod = new AuthMethod(data['authMethod'] as AuthMethodType);
    const sessionId = new SessionId(data['sessionId'] || `session_${Date.now()}`);
    const roles = new RoleSet();
    const permissions = new PermissionSet();
    const deviceInfo = DeviceInfo.fromBrowser();
    const geoLocation = new GeoLocation('Unknown', 'Unknown', 0, 0);
    const loginSource = LoginSource.WEB();
    const loginContext = new LoginContext('127.0.0.1', deviceInfo, geoLocation, loginSource);

    return new User(
      userId,
      email,
      displayName,
      photoUrl,
      status,
      isAnonymous,
      isEmailVerified,
      authProvider,
      authMethod,
      sessionId,
      roles,
      permissions,
      deviceInfo,
      geoLocation,
      loginContext,
      data['createdAt']?.toDate() || new Date(),
      data['updatedAt']?.toDate() || new Date(),
      data['phoneNumber']
    );
  }

  /**
   * Map User entity to Firestore document
   */
  private mapToFirestore(user: User): DocumentData {
    return {
      email: user.email.getValue(),
      displayName: user.displayName.getValue(),
      photoURL: user.photoUrl.getValue(),
      status: user.status.getValue(),
      isAnonymous: user.isAnonymous.getValue(),
      isEmailVerified: user.isEmailVerified.getValue(),
      authProvider: user.authProvider.getValue(),
      authMethod: user.authMethod.getValue(),
      sessionId: user.sessionId.getValue(),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      phoneNumber: user.phoneNumber
    };
  }
} 