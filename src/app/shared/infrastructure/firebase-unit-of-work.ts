import { Injectable } from '@angular/core';
import { UnitOfWork } from '../application/unit-of-work';

@Injectable({
    providedIn: 'root'
})
export class FirebaseUnitOfWork extends UnitOfWork {
    async execute<T>(work: () => Promise<T>): Promise<T> {
        // For now, we don't have transactional logic, so we just execute the work.
        // In a real application, you would wrap this in a Firebase transaction.
        return work();
    }
}
