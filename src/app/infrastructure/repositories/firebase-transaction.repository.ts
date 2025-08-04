import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDoc, getDocs, setDoc, deleteDoc, query, where, orderBy, limit, startAfter, DocumentData, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { Transaction, TransactionStatus, TransactionType } from '../../domain/entities/transaction.entity';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';

@Injectable({ providedIn: 'root' })
export class FirebaseTransactionRepository implements TransactionRepository {
  private readonly collectionName = 'transactions';

  constructor(private firestore: Firestore) {}

  async findById(id: string): Promise<Transaction | null> {
    try {
      const docRef = doc(this.firestore, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return this.mapFromFirestore(docSnap.data(), docSnap.id);
      }
      return null;
    } catch (error) {
      console.error('Error finding transaction by ID:', error);
      throw new Error('Failed to find transaction by ID');
    }
  }

  async findByTransactionNumber(transactionNumber: string): Promise<Transaction | null> {
    try {
      const q = query(
        collection(this.firestore, this.collectionName),
        where('transactionNumber', '==', transactionNumber)
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return this.mapFromFirestore(doc.data(), doc.id);
      }
      return null;
    } catch (error) {
      console.error('Error finding transaction by number:', error);
      throw new Error('Failed to find transaction by number');
    }
  }

  async findByAccountId(accountId: string): Promise<Transaction[]> {
    try {
      const q = query(
        collection(this.firestore, this.collectionName),
        where('accountId', '==', accountId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => 
        this.mapFromFirestore(doc.data(), doc.id)
      );
    } catch (error) {
      console.error('Error finding transactions by account ID:', error);
      throw new Error('Failed to find transactions by account ID');
    }
  }

  async findByUserId(userId: string): Promise<Transaction[]> {
    try {
      const q = query(
        collection(this.firestore, this.collectionName),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => 
        this.mapFromFirestore(doc.data(), doc.id)
      );
    } catch (error) {
      console.error('Error finding transactions by user ID:', error);
      throw new Error('Failed to find transactions by user ID');
    }
  }

  async findByStatus(status: TransactionStatus): Promise<Transaction[]> {
    try {
      const q = query(
        collection(this.firestore, this.collectionName),
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => 
        this.mapFromFirestore(doc.data(), doc.id)
      );
    } catch (error) {
      console.error('Error finding transactions by status:', error);
      throw new Error('Failed to find transactions by status');
    }
  }

  async findByType(type: TransactionType): Promise<Transaction[]> {
    try {
      const q = query(
        collection(this.firestore, this.collectionName),
        where('transactionType', '==', type),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => 
        this.mapFromFirestore(doc.data(), doc.id)
      );
    } catch (error) {
      console.error('Error finding transactions by type:', error);
      throw new Error('Failed to find transactions by type');
    }
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Transaction[]> {
    try {
      const q = query(
        collection(this.firestore, this.collectionName),
        where('createdAt', '>=', startDate),
        where('createdAt', '<=', endDate),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => 
        this.mapFromFirestore(doc.data(), doc.id)
      );
    } catch (error) {
      console.error('Error finding transactions by date range:', error);
      throw new Error('Failed to find transactions by date range');
    }
  }

  async findByAmountRange(minAmount: number, maxAmount: number): Promise<Transaction[]> {
    try {
      const q = query(
        collection(this.firestore, this.collectionName),
        where('amount', '>=', minAmount),
        where('amount', '<=', maxAmount),
        orderBy('amount', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => 
        this.mapFromFirestore(doc.data(), doc.id)
      );
    } catch (error) {
      console.error('Error finding transactions by amount range:', error);
      throw new Error('Failed to find transactions by amount range');
    }
  }

  async findByReferenceNumber(referenceNumber: string): Promise<Transaction[]> {
    try {
      const q = query(
        collection(this.firestore, this.collectionName),
        where('referenceNumber', '==', referenceNumber),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => 
        this.mapFromFirestore(doc.data(), doc.id)
      );
    } catch (error) {
      console.error('Error finding transactions by reference number:', error);
      throw new Error('Failed to find transactions by reference number');
    }
  }

  async findByCategory(category: string): Promise<Transaction[]> {
    try {
      const q = query(
        collection(this.firestore, this.collectionName),
        where('category', '==', category),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => 
        this.mapFromFirestore(doc.data(), doc.id)
      );
    } catch (error) {
      console.error('Error finding transactions by category:', error);
      throw new Error('Failed to find transactions by category');
    }
  }

  async findAll(): Promise<Transaction[]> {
    try {
      const q = query(
        collection(this.firestore, this.collectionName),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => 
        this.mapFromFirestore(doc.data(), doc.id)
      );
    } catch (error) {
      console.error('Error finding all transactions:', error);
      throw new Error('Failed to find all transactions');
    }
  }

  async save(transaction: Transaction): Promise<void> {
    try {
      const docRef = doc(this.firestore, this.collectionName, transaction.id);
      await setDoc(docRef, this.mapToFirestore(transaction));
    } catch (error) {
      console.error('Error saving transaction:', error);
      throw new Error('Failed to save transaction');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(this.firestore, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw new Error('Failed to delete transaction');
    }
  }

  async existsById(id: string): Promise<boolean> {
    try {
      const docRef = doc(this.firestore, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists();
    } catch (error) {
      console.error('Error checking transaction existence:', error);
      throw new Error('Failed to check transaction existence');
    }
  }

  async existsByTransactionNumber(transactionNumber: string): Promise<boolean> {
    try {
      const q = query(
        collection(this.firestore, this.collectionName),
        where('transactionNumber', '==', transactionNumber)
      );
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking transaction number existence:', error);
      throw new Error('Failed to check transaction number existence');
    }
  }

  async count(): Promise<number> {
    try {
      const querySnapshot = await getDocs(collection(this.firestore, this.collectionName));
      return querySnapshot.size;
    } catch (error) {
      console.error('Error counting transactions:', error);
      throw new Error('Failed to count transactions');
    }
  }

  async countByStatus(status: TransactionStatus): Promise<number> {
    try {
      const q = query(
        collection(this.firestore, this.collectionName),
        where('status', '==', status)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.size;
    } catch (error) {
      console.error('Error counting transactions by status:', error);
      throw new Error('Failed to count transactions by status');
    }
  }

  async countByType(type: TransactionType): Promise<number> {
    try {
      const q = query(
        collection(this.firestore, this.collectionName),
        where('transactionType', '==', type)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.size;
    } catch (error) {
      console.error('Error counting transactions by type:', error);
      throw new Error('Failed to count transactions by type');
    }
  }

  async countByAccountId(accountId: string): Promise<number> {
    try {
      const q = query(
        collection(this.firestore, this.collectionName),
        where('accountId', '==', accountId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.size;
    } catch (error) {
      console.error('Error counting transactions by account ID:', error);
      throw new Error('Failed to count transactions by account ID');
    }
  }

  async countByUserId(userId: string): Promise<number> {
    try {
      const q = query(
        collection(this.firestore, this.collectionName),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.size;
    } catch (error) {
      console.error('Error counting transactions by user ID:', error);
      throw new Error('Failed to count transactions by user ID');
    }
  }

  async getStatistics(): Promise<{
    totalCount: number;
    totalAmount: number;
    byStatus: Record<TransactionStatus, number>;
    byType: Record<TransactionType, number>;
    averageAmount: number;
    completedCount: number;
    pendingCount: number;
  }> {
    try {
      const transactions = await this.findAll();
      return this.calculateStatistics(transactions);
    } catch (error) {
      console.error('Error getting transaction statistics:', error);
      throw new Error('Failed to get transaction statistics');
    }
  }

  async getAccountStatistics(accountId: string): Promise<{
    totalCount: number;
    totalAmount: number;
    byStatus: Record<TransactionStatus, number>;
    byType: Record<TransactionType, number>;
    averageAmount: number;
    completedCount: number;
    pendingCount: number;
  }> {
    try {
      const transactions = await this.findByAccountId(accountId);
      return this.calculateStatistics(transactions);
    } catch (error) {
      console.error('Error getting account transaction statistics:', error);
      throw new Error('Failed to get account transaction statistics');
    }
  }

  async getUserStatistics(userId: string): Promise<{
    totalCount: number;
    totalAmount: number;
    byStatus: Record<TransactionStatus, number>;
    byType: Record<TransactionType, number>;
    averageAmount: number;
    completedCount: number;
    pendingCount: number;
  }> {
    try {
      const transactions = await this.findByUserId(userId);
      return this.calculateStatistics(transactions);
    } catch (error) {
      console.error('Error getting user transaction statistics:', error);
      throw new Error('Failed to get user transaction statistics');
    }
  }

  // Private helper methods
  private mapToFirestore(transaction: Transaction): DocumentData {
    return {
      transactionNumber: transaction.transactionNumber,
      accountId: transaction.accountId,
      userId: transaction.userId,
      amount: transaction.amount,
      currency: transaction.currency,
      transactionType: transaction.transactionType,
      status: transaction.status,
      description: transaction.description,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
      referenceNumber: transaction.referenceNumber,
      category: transaction.category,
      fees: transaction.fees,
      notes: transaction.notes
    };
  }

  private mapFromFirestore(data: DocumentData, id: string): Transaction {
    return new Transaction(
      id,
      data['transactionNumber'],
      data['accountId'],
      data['userId'],
      data['amount'],
      data['currency'],
      data['transactionType'],
      data['status'],
      data['description'],
      data['createdAt']?.toDate() || new Date(),
      data['updatedAt']?.toDate() || new Date(),
      data['referenceNumber'],
      data['category'],
      data['fees'],
      data['notes']
    );
  }

  private calculateStatistics(transactions: Transaction[]): {
    totalCount: number;
    totalAmount: number;
    byStatus: Record<TransactionStatus, number>;
    byType: Record<TransactionType, number>;
    averageAmount: number;
    completedCount: number;
    pendingCount: number;
  } {
    const stats = {
      totalCount: transactions.length,
      totalAmount: 0,
      byStatus: {} as Record<TransactionStatus, number>,
      byType: {} as Record<TransactionType, number>,
      averageAmount: 0,
      completedCount: 0,
      pendingCount: 0
    };

    // Initialize counters
    Object.values(TransactionStatus).forEach(status => {
      stats.byStatus[status] = 0;
    });
    Object.values(TransactionType).forEach(type => {
      stats.byType[type] = 0;
    });

    // Calculate statistics
    transactions.forEach(transaction => {
      stats.totalAmount += transaction.amount;
      stats.byStatus[transaction.status]++;
      stats.byType[transaction.transactionType]++;
      
      if (transaction.isCompleted()) {
        stats.completedCount++;
      }
      if (transaction.isPending()) {
        stats.pendingCount++;
      }
    });

    stats.averageAmount = stats.totalCount > 0 ? stats.totalAmount / stats.totalCount : 0;

    return stats;
  }
} 