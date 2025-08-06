// src/app/domain/contract-extraction/infrastructure/firebase/firebase-contract-extraction.repository.ts
import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy } from '@angular/fire/firestore';
import { ContractExtractionRepository } from '../../domain/repositories/contract-extraction.repository';
import { ContractExtraction } from '../../domain/entities/contract-extraction.entity';
import { ExtractionId } from '../../domain/value-objects/extraction-id.vo';
import { ContractId } from '../../../contract-management/domain/value-objects/contract-id.vo';
import { Task } from '../../domain/entities/task.entity';
import { Milestone } from '../../domain/entities/milestone.entity';
import { ContractTerm } from '../../domain/entities/contract-term.entity';

export interface ContractExtractionDocument {
    id: string;
    contractId: string;
    status: string;
    originalPdfUrl: string;
    extractedText: string;
    processingError?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface TaskDocument {
    id: string;
    extractionId: string;
    title: string;
    description: string;
    taskType: string;
    priority: string;
    dueDate?: Date;
    assignedTo?: string;
    sourceText: string;
    confidence: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface MilestoneDocument {
    id: string;
    extractionId: string;
    title: string;
    description: string;
    dueDate: Date;
    milestoneType: string;
    sourceText: string;
    confidence: number;
    isCompleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ContractTermDocument {
    id: string;
    extractionId: string;
    termType: string;
    title: string;
    content: string;
    clauseNumber?: string;
    section?: string;
    sourceText: string;
    confidence: number;
    isCritical: boolean;
    createdAt: Date;
    updatedAt: Date;
}

@Injectable({
    providedIn: 'root'
})
export class FirebaseContractExtractionRepository implements ContractExtractionRepository {

    private readonly COLLECTION_NAME = 'contract_extractions';
    private readonly TASKS_COLLECTION = 'extraction_tasks';
    private readonly MILESTONES_COLLECTION = 'extraction_milestones';
    private readonly CONTRACT_TERMS_COLLECTION = 'extraction_contract_terms';

    constructor(private firestore: Firestore) { }

    async findById(id: ExtractionId): Promise<ContractExtraction | null> {
        try {
            const docRef = doc(this.firestore, this.COLLECTION_NAME, id.value);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                return null;
            }

            const data = docSnap.data() as ContractExtractionDocument;
            return this.documentToEntity(data);
        } catch (error) {
            console.error('Error finding extraction by ID:', error);
            throw new Error('Failed to find extraction by ID');
        }
    }

    async findAll(): Promise<ContractExtraction[]> {
        try {
            const querySnapshot = await getDocs(collection(this.firestore, this.COLLECTION_NAME));
            return querySnapshot.docs.map(doc => {
                const data = doc.data() as ContractExtractionDocument;
                return this.documentToEntity(data);
            });
        } catch (error) {
            console.error('Error finding all extractions:', error);
            throw new Error('Failed to find all extractions');
        }
    }

    async save(extraction: ContractExtraction): Promise<void> {
        try {
            const docRef = doc(this.firestore, this.COLLECTION_NAME, extraction.id.value);
            const document = this.entityToDocument(extraction);
            await updateDoc(docRef, document as any);
        } catch (error) {
            console.error('Error saving extraction:', error);
            throw new Error('Failed to save extraction');
        }
    }

    async delete(id: ExtractionId): Promise<void> {
        try {
            const docRef = doc(this.firestore, this.COLLECTION_NAME, id.value);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Error deleting extraction:', error);
            throw new Error('Failed to delete extraction');
        }
    }

    async findByContractId(contractId: ContractId): Promise<ContractExtraction[]> {
        try {
            const q = query(
                collection(this.firestore, this.COLLECTION_NAME),
                where('contractId', '==', contractId.value),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => {
                const data = doc.data() as ContractExtractionDocument;
                return this.documentToEntity(data);
            });
        } catch (error) {
            console.error('Error finding extractions by contract ID:', error);
            throw new Error('Failed to find extractions by contract ID');
        }
    }

    async findByStatus(status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'): Promise<ContractExtraction[]> {
        try {
            const q = query(
                collection(this.firestore, this.COLLECTION_NAME),
                where('status', '==', status),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => {
                const data = doc.data() as ContractExtractionDocument;
                return this.documentToEntity(data);
            });
        } catch (error) {
            console.error('Error finding extractions by status:', error);
            throw new Error('Failed to find extractions by status');
        }
    }

    async findCompleted(): Promise<ContractExtraction[]> {
        return this.findByStatus('COMPLETED');
    }

    async findFailed(): Promise<ContractExtraction[]> {
        return this.findByStatus('FAILED');
    }

    async saveWithEntities(extraction: ContractExtraction): Promise<void> {
        try {
            // Save main extraction
            await this.save(extraction);

            // Save tasks
            for (const task of extraction.tasks) {
                await this.saveTask(task);
            }

            // Save milestones
            for (const milestone of extraction.milestones) {
                await this.saveMilestone(milestone);
            }

            // Save contract terms
            for (const contractTerm of extraction.contractTerms) {
                await this.saveContractTerm(contractTerm);
            }
        } catch (error) {
            console.error('Error saving extraction with entities:', error);
            throw new Error('Failed to save extraction with entities');
        }
    }

    async deleteWithEntities(extractionId: ExtractionId): Promise<void> {
        try {
            // Delete tasks
            const tasksQuery = query(
                collection(this.firestore, this.TASKS_COLLECTION),
                where('extractionId', '==', extractionId.value)
            );
            const tasksSnapshot = await getDocs(tasksQuery);
            for (const taskDoc of tasksSnapshot.docs) {
                await deleteDoc(taskDoc.ref);
            }

            // Delete milestones
            const milestonesQuery = query(
                collection(this.firestore, this.MILESTONES_COLLECTION),
                where('extractionId', '==', extractionId.value)
            );
            const milestonesSnapshot = await getDocs(milestonesQuery);
            for (const milestoneDoc of milestonesSnapshot.docs) {
                await deleteDoc(milestoneDoc.ref);
            }

            // Delete contract terms
            const contractTermsQuery = query(
                collection(this.firestore, this.CONTRACT_TERMS_COLLECTION),
                where('extractionId', '==', extractionId.value)
            );
            const contractTermsSnapshot = await getDocs(contractTermsQuery);
            for (const contractTermDoc of contractTermsSnapshot.docs) {
                await deleteDoc(contractTermDoc.ref);
            }

            // Delete main extraction
            await this.delete(extractionId);
        } catch (error) {
            console.error('Error deleting extraction with entities:', error);
            throw new Error('Failed to delete extraction with entities');
        }
    }

    private async saveTask(task: Task): Promise<void> {
        try {
            const docRef = doc(this.firestore, this.TASKS_COLLECTION, task.id.value);
            const document = this.taskToDocument(task);
            await updateDoc(docRef, document as any);
        } catch (error) {
            console.error('Error saving task:', error);
            throw new Error('Failed to save task');
        }
    }

    private async saveMilestone(milestone: Milestone): Promise<void> {
        try {
            const docRef = doc(this.firestore, this.MILESTONES_COLLECTION, milestone.id.value);
            const document = this.milestoneToDocument(milestone);
            await updateDoc(docRef, document as any);
        } catch (error) {
            console.error('Error saving milestone:', error);
            throw new Error('Failed to save milestone');
        }
    }

    private async saveContractTerm(contractTerm: ContractTerm): Promise<void> {
        try {
            const docRef = doc(this.firestore, this.CONTRACT_TERMS_COLLECTION, contractTerm.id.value);
            const document = this.contractTermToDocument(contractTerm);
            await updateDoc(docRef, document as any);
        } catch (error) {
            console.error('Error saving contract term:', error);
            throw new Error('Failed to save contract term');
        }
    }

    private documentToEntity(document: ContractExtractionDocument): ContractExtraction {
        const extractionId = ExtractionId.create(document.id);
        const contractId = ContractId.create(document.contractId);

        const extraction = new ContractExtraction(extractionId, contractId, document.originalPdfUrl);

        // Set status
        if (document.status === 'PROCESSING') {
            extraction.startProcessing();
        } else if (document.status === 'COMPLETED') {
            extraction.completeExtraction();
        } else if (document.status === 'FAILED') {
            extraction.failExtraction(document.processingError || 'Unknown error');
        }

        // Set extracted text
        if (document.extractedText) {
            extraction.setExtractedText(document.extractedText);
        }

        return extraction;
    }

    private entityToDocument(extraction: ContractExtraction): ContractExtractionDocument {
        return {
            id: extraction.id.value,
            contractId: extraction.contractId.value,
            status: extraction.status.value,
            originalPdfUrl: extraction.originalPdfUrl,
            extractedText: extraction.extractedText,
            processingError: extraction.processingError,
            createdAt: extraction.createdAt,
            updatedAt: extraction.updatedAt
        };
    }

    private taskToDocument(task: Task): TaskDocument {
        return {
            id: task.id.value,
            extractionId: task.extractionId.value,
            title: task.title,
            description: task.description,
            taskType: task.taskType,
            priority: task.priority,
            dueDate: task.dueDate,
            assignedTo: task.assignedTo,
            sourceText: task.sourceText,
            confidence: task.confidence,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt
        };
    }

    private milestoneToDocument(milestone: Milestone): MilestoneDocument {
        return {
            id: milestone.id.value,
            extractionId: milestone.extractionId.value,
            title: milestone.title,
            description: milestone.description,
            dueDate: milestone.dueDate,
            milestoneType: milestone.milestoneType,
            sourceText: milestone.sourceText,
            confidence: milestone.confidence,
            isCompleted: milestone.isCompleted,
            createdAt: milestone.createdAt,
            updatedAt: milestone.updatedAt
        };
    }

    private contractTermToDocument(contractTerm: ContractTerm): ContractTermDocument {
        return {
            id: contractTerm.id.value,
            extractionId: contractTerm.extractionId.value,
            termType: contractTerm.termType,
            title: contractTerm.title,
            content: contractTerm.content,
            clauseNumber: contractTerm.clauseNumber,
            section: contractTerm.section,
            sourceText: contractTerm.sourceText,
            confidence: contractTerm.confidence,
            isCritical: contractTerm.isCritical,
            createdAt: contractTerm.createdAt,
            updatedAt: contractTerm.updatedAt
        };
    }
} 