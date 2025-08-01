import { Injectable } from '@angular/core';
import { Auth, User, signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword, sendPasswordResetEmail, updateProfile } from '@angular/fire/auth';
import { Firestore, collection, doc, getDoc, setDoc, updateDoc, deleteDoc, query, where, getDocs, orderBy, limit } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL, deleteObject } from '@angular/fire/storage';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { Messaging, getToken, onMessage } from '@angular/fire/messaging';
import { Performance, trace } from '@angular/fire/performance';
import { RemoteConfig, fetchAndActivate, getValue } from '@angular/fire/remote-config';
import { Analytics, logEvent, setUserId, setUserProperties } from '@angular/fire/analytics';
import { BehaviorSubject } from 'rxjs';

export interface FirebaseConfig {
    projectId: string;
    appId: string;
    storageBucket: string;
    apiKey: string;
    authDomain: string;
    messagingSenderId: string;
    measurementId: string;
}

@Injectable({
    providedIn: 'root'
})
export class FirebaseService {
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(
        private auth: Auth,
        private firestore: Firestore,
        private storage: Storage,
        private functions: Functions,
        private messaging: Messaging,
        private performance: Performance,
        private remoteConfig: RemoteConfig,
        private analytics: Analytics
    ) {
        this.initializeAuth();
        this.initializeRemoteConfig();
        this.initializeMessaging();
    }

    /**
     * 初始化認證狀態監聽
     */
    private initializeAuth(): void {
        onAuthStateChanged(this.auth, (user) => {
            this.currentUserSubject.next(user);
            if (user) {
                this.setAnalyticsUser(user);
            }
        });
    }

    /**
     * 初始化遠端配置
     */
    private async initializeRemoteConfig(): Promise<void> {
        try {
            await fetchAndActivate(this.remoteConfig);
            console.log('Remote config activated');
        } catch (error) {
            console.error('Failed to activate remote config:', error);
        }
    }

    /**
     * 初始化推送通知
     */
    private async initializeMessaging(): Promise<void> {
        try {
            const token = await getToken(this.messaging);
            console.log('FCM Token:', token);

            onMessage(this.messaging, (payload) => {
                console.log('Message received:', payload);
                // 處理前台消息
            });
        } catch (error) {
            console.error('Failed to initialize messaging:', error);
        }
    }

    /**
     * 設置分析用戶
     */
    private setAnalyticsUser(user: User): void {
        setUserId(this.analytics, user.uid);
        setUserProperties(this.analytics, {
            email: user.email || '',
            displayName: user.displayName || ''
        });
    }

    // ==================== 認證相關方法 ====================

    /**
     * 使用郵箱密碼登入
     */
    async signInWithEmail(email: string, password: string): Promise<User> {
        try {
            const result = await signInWithEmailAndPassword(this.auth, email, password);
            logEvent(this.analytics, 'login', { method: 'email' });
            return result.user;
        } catch (error) {
            console.error('Sign in error:', error);
            throw error;
        }
    }

    /**
     * 註冊新用戶
     */
    async signUpWithEmail(email: string, password: string, displayName?: string): Promise<User> {
        try {
            const result = await createUserWithEmailAndPassword(this.auth, email, password);
            if (displayName) {
                await updateProfile(result.user, { displayName });
            }
            logEvent(this.analytics, 'sign_up', { method: 'email' });
            return result.user;
        } catch (error) {
            console.error('Sign up error:', error);
            throw error;
        }
    }

    /**
     * 登出
     */
    async signOut(): Promise<void> {
        try {
            await signOut(this.auth);
            logEvent(this.analytics, 'logout');
        } catch (error) {
            console.error('Sign out error:', error);
            throw error;
        }
    }

    /**
     * 發送密碼重置郵件
     */
    async sendPasswordResetEmail(email: string): Promise<void> {
        try {
            await sendPasswordResetEmail(this.auth, email);
            logEvent(this.analytics, 'password_reset_requested');
        } catch (error) {
            console.error('Password reset error:', error);
            throw error;
        }
    }

    /**
     * 獲取當前用戶
     */
    getCurrentUser(): User | null {
        return this.auth.currentUser;
    }

    // ==================== Firestore 相關方法 ====================

    /**
     * 創建文檔
     */
    async createDocument<T>(collectionName: string, data: T, docId?: string): Promise<string> {
        try {
            const docRef = docId ? doc(this.firestore, collectionName, docId) : doc(collection(this.firestore, collectionName));
            await setDoc(docRef, { ...data, createdAt: new Date(), updatedAt: new Date() });
            logEvent(this.analytics, 'document_created', { collection: collectionName });
            return docRef.id;
        } catch (error) {
            console.error('Create document error:', error);
            throw error;
        }
    }

    /**
     * 更新文檔
     */
    async updateDocument<T>(collectionName: string, docId: string, data: Partial<T>): Promise<void> {
        try {
            const docRef = doc(this.firestore, collectionName, docId);
            await updateDoc(docRef, { ...data, updatedAt: new Date() });
            logEvent(this.analytics, 'document_updated', { collection: collectionName });
        } catch (error) {
            console.error('Update document error:', error);
            throw error;
        }
    }

    /**
     * 獲取文檔
     */
    async getDocument<T>(collectionName: string, docId: string): Promise<T | null> {
        try {
            const docRef = doc(this.firestore, collectionName, docId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return docSnap.data() as T;
            }
            return null;
        } catch (error) {
            console.error('Get document error:', error);
            throw error;
        }
    }

    /**
     * 刪除文檔
     */
    async deleteDocument(collectionName: string, docId: string): Promise<void> {
        try {
            const docRef = doc(this.firestore, collectionName, docId);
            await deleteDoc(docRef);
            logEvent(this.analytics, 'document_deleted', { collection: collectionName });
        } catch (error) {
            console.error('Delete document error:', error);
            throw error;
        }
    }

    /**
     * 查詢文檔
     */
    async queryDocuments<T>(
        collectionName: string,
        conditions: Array<{ field: string; operator: any; value: any }> = [],
        orderByField?: string,
        orderDirection: 'asc' | 'desc' = 'desc',
        limitCount?: number
    ): Promise<T[]> {
        try {
            let q = query(collection(this.firestore, collectionName));

            // 添加查詢條件
            conditions.forEach(condition => {
                q = query(q, where(condition.field, condition.operator, condition.value));
            });

            // 添加排序
            if (orderByField) {
                q = query(q, orderBy(orderByField, orderDirection));
            }

            // 添加限制
            if (limitCount) {
                q = query(q, limit(limitCount));
            }

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as T[];
        } catch (error) {
            console.error('Query documents error:', error);
            throw error;
        }
    }

    // ==================== Storage 相關方法 ====================

    /**
     * 上傳文件
     */
    async uploadFile(file: File, path: string): Promise<string> {
        try {
            const storageRef = ref(this.storage, path);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            logEvent(this.analytics, 'file_uploaded', { path });
            return downloadURL;
        } catch (error) {
            console.error('Upload file error:', error);
            throw error;
        }
    }

    /**
     * 刪除文件
     */
    async deleteFile(path: string): Promise<void> {
        try {
            const storageRef = ref(this.storage, path);
            await deleteObject(storageRef);
            logEvent(this.analytics, 'file_deleted', { path });
        } catch (error) {
            console.error('Delete file error:', error);
            throw error;
        }
    }

    /**
     * 獲取文件下載 URL
     */
    async getDownloadURL(path: string): Promise<string> {
        try {
            const storageRef = ref(this.storage, path);
            return await getDownloadURL(storageRef);
        } catch (error) {
            console.error('Get download URL error:', error);
            throw error;
        }
    }

    // ==================== Functions 相關方法 ====================

    /**
     * 調用雲端函數
     */
    async callFunction<T>(functionName: string, data?: any): Promise<T> {
        try {
            const callable = httpsCallable(this.functions, functionName);
            const result = await callable(data);
            logEvent(this.analytics, 'function_called', { function: functionName });
            return result.data as T;
        } catch (error) {
            console.error('Call function error:', error);
            throw error;
        }
    }

    // ==================== Performance 相關方法 ====================

    /**
     * 開始性能追蹤
     */
    startTrace(traceName: string): any {
        return trace(this.performance, traceName);
    }

    // ==================== Remote Config 相關方法 ====================

    /**
     * 獲取遠端配置值
     */
    getRemoteConfigValue(key: string, defaultValue?: any): any {
        try {
            const value = getValue(this.remoteConfig, key);
            return value.asString() || defaultValue;
        } catch (error) {
            console.error('Get remote config error:', error);
            return defaultValue;
        }
    }

    // ==================== Analytics 相關方法 ====================

    /**
     * 記錄自定義事件
     */
    logCustomEvent(eventName: string, parameters?: { [key: string]: any }): void {
        try {
            logEvent(this.analytics, eventName, parameters);
        } catch (error) {
            console.error('Log custom event error:', error);
        }
    }

    // ==================== 實用方法 ====================

    /**
     * 檢查用戶是否已登入
     */
    isAuthenticated(): boolean {
        return this.auth.currentUser !== null;
    }

    /**
     * 獲取用戶 ID
     */
    getUserId(): string | null {
        return this.auth.currentUser?.uid || null;
    }

    /**
     * 獲取用戶郵箱
     */
    getUserEmail(): string | null {
        return this.auth.currentUser?.email || null;
    }

    /**
     * 獲取用戶顯示名稱
     */
    getUserDisplayName(): string | null {
        return this.auth.currentUser?.displayName || null;
    }
} 