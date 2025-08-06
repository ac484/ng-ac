import { Injectable } from '@angular/core';
import { DashboardRepository } from '../../domain/repositories/dashboard.repository';
import { DashboardLayout } from '../../domain/entities/dashboard-layout.entity';
import { Firestore, collection, doc, getDoc, setDoc, deleteDoc } from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class DashboardFirebaseRepository extends DashboardRepository {
    private readonly collection;

    constructor(private readonly firestore: Firestore) {
        super();
        this.collection = collection(this.firestore, 'dashboards');
    }

    async findById(id: string): Promise<DashboardLayout | null> {
        const docRef = doc(this.firestore, `dashboards/${id}`);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? new DashboardLayout(id, docSnap.data()['layout']) : null;
    }

    findAll(): Promise<DashboardLayout[]> {
        throw new Error('Method not implemented.');
    }

    async save(entity: DashboardLayout): Promise<void> {
        const docRef = doc(this.firestore, `dashboards/${entity.id}`);
        return setDoc(docRef, { layout: entity.layout }, { merge: true });
    }

    async delete(id: string): Promise<void> {
        const docRef = doc(this.firestore, `dashboards/${id}`);
        return deleteDoc(docRef);
    }
}
