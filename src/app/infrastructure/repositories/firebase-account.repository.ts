import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDoc, getDocs, setDoc, deleteDoc, query, where, orderBy, limit, startAfter, DocumentData, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { Account, AccountStatus, AccountType } from '../../domain/entities/account.entity';
import { AccountRepository } from '../../domain/repositories/account.repository';

/**
 * Firebase implementation of Account repository
 * Handles all account data persistence using Firestore
 */
@Injectable({ providedIn: 'root' })
export class FirebaseAccountRepository implements AccountRepository {
  private readonly collectionName = 'accounts';

  constructor(private firestore: Firestore) {}

  async findById(id: string): Promise<Account | null> {
    try {
      const docRef = doc(this.firestore, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return this.mapFromFirestore(docSnap.data(), docSnap.id);
      }
      return null;
    } catch (error) {
      console.error('Error finding account by ID:', error);
      throw new Error('Failed to find account by ID');
    }
  }

  async findByAccountNumber(accountNumber: string): Promise<Account | null> {
    try {
      const accountsRef = collection(this.firestore, this.collectionName);
      const q = query(accountsRef, where('accountNumber', '==', accountNumber));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return this.mapFromFirestore(doc.data(), doc.id);
      }
      return null;
    } catch (error) {
      console.error('Error finding account by number:', error);
      throw new Error('Failed to find account by number');
    }
  }

  async findByUserId(userId: string): Promise<Account[]> {
    try {
      const accountsRef = collection(this.firestore, this.collectionName);
      const q = query(accountsRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => this.mapFromFirestore(doc.data(), doc.id));
    } catch (error) {
      console.error('Error finding accounts by user ID:', error);
      throw new Error('Failed to find accounts by user ID');
    }
  }

  async findByStatus(status: AccountStatus): Promise<Account[]> {
    try {
      const accountsRef = collection(this.firestore, this.collectionName);
      const q = query(accountsRef, where('status', '==', status), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => this.mapFromFirestore(doc.data(), doc.id));
    } catch (error) {
      console.error('Error finding accounts by status:', error);
      throw new Error('Failed to find accounts by status');
    }
  }

  async findByType(accountType: AccountType): Promise<Account[]> {
    try {
      const accountsRef = collection(this.firestore, this.collectionName);
      const q = query(accountsRef, where('accountType', '==', accountType), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => this.mapFromFirestore(doc.data(), doc.id));
    } catch (error) {
      console.error('Error finding accounts by type:', error);
      throw new Error('Failed to find accounts by type');
    }
  }

  async findAll(status?: AccountStatus, accountType?: AccountType): Promise<Account[]> {
    try {
      const accountsRef = collection(this.firestore, this.collectionName);
      let q = query(accountsRef, orderBy('createdAt', 'desc'));

      if (status) {
        q = query(accountsRef, where('status', '==', status), orderBy('createdAt', 'desc'));
      }
      if (accountType) {
        q = query(accountsRef, where('accountType', '==', accountType), orderBy('createdAt', 'desc'));
      }
      if (status && accountType) {
        q = query(
          accountsRef,
          where('status', '==', status),
          where('accountType', '==', accountType),
          orderBy('createdAt', 'desc')
        );
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => this.mapFromFirestore(doc.data(), doc.id));
    } catch (error) {
      console.error('Error finding all accounts:', error);
      throw new Error('Failed to find all accounts');
    }
  }

  async save(account: Account): Promise<void> {
    try {
      const docRef = doc(this.firestore, this.collectionName, account.id);
      await setDoc(docRef, this.mapToFirestore(account));
    } catch (error) {
      console.error('Error saving account:', error);
      throw new Error('Failed to save account');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(this.firestore, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting account:', error);
      throw new Error('Failed to delete account');
    }
  }

  async existsByAccountNumber(accountNumber: string): Promise<boolean> {
    try {
      const account = await this.findByAccountNumber(accountNumber);
      return account !== null;
    } catch (error) {
      console.error('Error checking account existence:', error);
      throw new Error('Failed to check account existence');
    }
  }

  async count(status?: AccountStatus): Promise<number> {
    try {
      const accounts = await this.findAll(status);
      return accounts.length;
    } catch (error) {
      console.error('Error counting accounts:', error);
      throw new Error('Failed to count accounts');
    }
  }

  async findByBalanceRange(minBalance: number, maxBalance: number): Promise<Account[]> {
    try {
      const accountsRef = collection(this.firestore, this.collectionName);
      const q = query(
        accountsRef,
        where('balance', '>=', minBalance),
        where('balance', '<=', maxBalance),
        orderBy('balance', 'desc')
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => this.mapFromFirestore(doc.data(), doc.id));
    } catch (error) {
      console.error('Error finding accounts by balance range:', error);
      throw new Error('Failed to find accounts by balance range');
    }
  }

  async findByCurrency(currency: string): Promise<Account[]> {
    try {
      const accountsRef = collection(this.firestore, this.collectionName);
      const q = query(accountsRef, where('currency', '==', currency), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => this.mapFromFirestore(doc.data(), doc.id));
    } catch (error) {
      console.error('Error finding accounts by currency:', error);
      throw new Error('Failed to find accounts by currency');
    }
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Account[]> {
    try {
      const accountsRef = collection(this.firestore, this.collectionName);
      const q = query(
        accountsRef,
        where('createdAt', '>=', startDate),
        where('createdAt', '<=', endDate),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => this.mapFromFirestore(doc.data(), doc.id));
    } catch (error) {
      console.error('Error finding accounts by date range:', error);
      throw new Error('Failed to find accounts by date range');
    }
  }

  async getStatistics(): Promise<{
    total: number;
    active: number;
    inactive: number;
    suspended: number;
    closed: number;
    totalBalance: number;
    averageBalance: number;
  }> {
    try {
      const allAccounts = await this.findAll();
      
      const total = allAccounts.length;
      const active = allAccounts.filter(acc => acc.status.getValue() === 'ACTIVE').length;
      const inactive = allAccounts.filter(acc => acc.status.getValue() === 'INACTIVE').length;
      const suspended = allAccounts.filter(acc => acc.status.getValue() === 'SUSPENDED').length;
      const closed = allAccounts.filter(acc => acc.status.getValue() === 'CLOSED').length;
      
      const totalBalance = allAccounts.reduce((sum, acc) => sum + acc.balance.getAmount(), 0);
      const averageBalance = total > 0 ? totalBalance / total : 0;

      return {
        total,
        active,
        inactive,
        suspended,
        closed,
        totalBalance,
        averageBalance
      };
    } catch (error) {
      console.error('Error getting account statistics:', error);
      throw new Error('Failed to get account statistics');
    }
  }

  /**
   * Map Firestore document to Account entity
   * @param data Firestore document data
   * @param id Document ID
   * @returns Account entity
   */
  private mapFromFirestore(data: DocumentData, id: string): Account {
    return new Account(
      id,
      data['accountNumber'],
      data['accountName'],
      data['accountType'],
      data['balance'] || 0,
      data['currency'] || 'USD',
      data['status'] || AccountStatus.ACTIVE,
      data['userId'],
      data['createdAt']?.toDate() || new Date(),
      data['updatedAt']?.toDate() || new Date(),
      data['description'],
      data['lastTransactionDate']?.toDate()
    );
  }

  /**
   * Map Account entity to Firestore document
   * @param account Account entity
   * @returns Firestore document data
   */
  private mapToFirestore(account: Account): DocumentData {
    return {
      accountNumber: account.accountNumber,
      accountName: account.accountName,
      accountType: account.accountType,
      balance: account.balance,
      currency: account.currency,
      status: account.status,
      userId: account.userId,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
      description: account.description,
      lastTransactionDate: account.lastTransactionDate
    };
  }
} 