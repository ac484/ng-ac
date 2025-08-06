// src/app/domain/contract-extraction/presentation/components/contract-extraction.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StartContractExtractionUseCase, StartContractExtractionRequest, StartContractExtractionResponse } from '../../application/use-cases/start-contract-extraction.use-case';
import { GetExtractionResultsUseCase, GetExtractionResultsRequest, GetExtractionResultsResponse } from '../../application/use-cases/get-extraction-results.use-case';

@Component({
    selector: 'app-contract-extraction',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
        <div class="contract-extraction-container">
            <h2>Contract Extraction</h2>
            
            <!-- Upload Section -->
            <div class="upload-section">
                <h3>Upload Contract PDF</h3>
                <div class="form-group">
                    <label for="contractId">Contract ID:</label>
                    <input 
                        type="text" 
                        id="contractId" 
                        [(ngModel)]="contractId" 
                        placeholder="Enter contract ID"
                        class="form-control"
                    />
                </div>
                <div class="form-group">
                    <label for="pdfUrl">PDF URL:</label>
                    <input 
                        type="url" 
                        id="pdfUrl" 
                        [(ngModel)]="pdfUrl" 
                        placeholder="Enter PDF URL"
                        class="form-control"
                    />
                </div>
                <button 
                    (click)="startExtraction()" 
                    [disabled]="isProcessing || !contractId || !pdfUrl"
                    class="btn btn-primary"
                >
                    {{ isProcessing ? 'Processing...' : 'Start Extraction' }}
                </button>
            </div>

            <!-- Results Section -->
            <div class="results-section" *ngIf="extractionResults">
                <h3>Extraction Results</h3>
                <div class="status-info">
                    <p><strong>Status:</strong> {{ extractionResults.status }}</p>
                    <p><strong>Extraction ID:</strong> {{ extractionResults.extractionId }}</p>
                    <p><strong>Contract ID:</strong> {{ extractionResults.contractId }}</p>
                </div>

                <!-- Tasks -->
                <div class="results-group" *ngIf="extractionResults.tasks.length > 0">
                    <h4>Tasks ({{ extractionResults.tasks.length }})</h4>
                    <div class="task-item" *ngFor="let task of extractionResults.tasks">
                        <h5>{{ task.title }}</h5>
                        <p><strong>Type:</strong> {{ task.taskType }}</p>
                        <p><strong>Priority:</strong> {{ task.priority }}</p>
                        <p><strong>Description:</strong> {{ task.description }}</p>
                        <p><strong>Due Date:</strong> {{ task.dueDate | date }}</p>
                        <p><strong>Assigned To:</strong> {{ task.assignedTo || 'Not assigned' }}</p>
                        <p><strong>Confidence:</strong> {{ (task.confidence * 100).toFixed(1) }}%</p>
                    </div>
                </div>

                <!-- Milestones -->
                <div class="results-group" *ngIf="extractionResults.milestones.length > 0">
                    <h4>Milestones ({{ extractionResults.milestones.length }})</h4>
                    <div class="milestone-item" *ngFor="let milestone of extractionResults.milestones">
                        <h5>{{ milestone.title }}</h5>
                        <p><strong>Type:</strong> {{ milestone.milestoneType }}</p>
                        <p><strong>Description:</strong> {{ milestone.description }}</p>
                        <p><strong>Due Date:</strong> {{ milestone.dueDate | date }}</p>
                        <p><strong>Status:</strong> {{ milestone.isCompleted ? 'Completed' : 'Pending' }}</p>
                        <p><strong>Confidence:</strong> {{ (milestone.confidence * 100).toFixed(1) }}%</p>
                    </div>
                </div>

                <!-- Contract Terms -->
                <div class="results-group" *ngIf="extractionResults.contractTerms.length > 0">
                    <h4>Contract Terms ({{ extractionResults.contractTerms.length }})</h4>
                    <div class="contract-term-item" *ngFor="let term of extractionResults.contractTerms">
                        <h5>{{ term.title }}</h5>
                        <p><strong>Type:</strong> {{ term.termType }}</p>
                        <p><strong>Content:</strong> {{ term.content }}</p>
                        <p><strong>Clause Number:</strong> {{ term.clauseNumber || 'N/A' }}</p>
                        <p><strong>Section:</strong> {{ term.section || 'N/A' }}</p>
                        <p><strong>Critical:</strong> {{ term.isCritical ? 'Yes' : 'No' }}</p>
                        <p><strong>Confidence:</strong> {{ (term.confidence * 100).toFixed(1) }}%</p>
                    </div>
                </div>

                <!-- Extracted Text -->
                <div class="results-group">
                    <h4>Extracted Text</h4>
                    <div class="extracted-text">
                        <pre>{{ extractionResults.extractedText }}</pre>
                    </div>
                </div>
            </div>

            <!-- Error Section -->
            <div class="error-section" *ngIf="errorMessage">
                <h3>Error</h3>
                <p class="error-message">{{ errorMessage }}</p>
            </div>
        </div>
    `,
    styles: [`
        .contract-extraction-container {
            padding: 20px;
            max-width: 1200px;
            margin: 0 auto;
        }

        .upload-section {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }

        .form-group {
            margin-bottom: 15px;
        }

        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }

        .form-control {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
        }

        .btn {
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }

        .btn-primary {
            background-color: #007bff;
            color: white;
        }

        .btn-primary:disabled {
            background-color: #6c757d;
            cursor: not-allowed;
        }

        .results-section {
            margin-top: 20px;
        }

        .status-info {
            background: #e9ecef;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 20px;
        }

        .results-group {
            margin-bottom: 30px;
        }

        .results-group h4 {
            color: #495057;
            border-bottom: 2px solid #dee2e6;
            padding-bottom: 10px;
            margin-bottom: 15px;
        }

        .task-item, .milestone-item, .contract-term-item {
            background: white;
            border: 1px solid #dee2e6;
            border-radius: 4px;
            padding: 15px;
            margin-bottom: 10px;
        }

        .task-item h5, .milestone-item h5, .contract-term-item h5 {
            color: #007bff;
            margin-top: 0;
            margin-bottom: 10px;
        }

        .extracted-text {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 4px;
            padding: 15px;
            max-height: 300px;
            overflow-y: auto;
        }

        .extracted-text pre {
            margin: 0;
            white-space: pre-wrap;
            word-wrap: break-word;
        }

        .error-section {
            background: #f8d7da;
            border: 1px solid #f5c6cb;
            border-radius: 4px;
            padding: 15px;
            margin-top: 20px;
        }

        .error-message {
            color: #721c24;
            margin: 0;
        }
    `]
})
export class ContractExtractionComponent implements OnInit {

    contractId: string = '';
    pdfUrl: string = '';
    isProcessing: boolean = false;
    extractionResults: GetExtractionResultsResponse | null = null;
    errorMessage: string = '';

    constructor(
        private startExtractionUseCase: StartContractExtractionUseCase,
        private getExtractionResultsUseCase: GetExtractionResultsUseCase
    ) { }

    ngOnInit(): void {
        // Component initialization
    }

    async startExtraction(): Promise<void> {
        if (!this.contractId || !this.pdfUrl) {
            this.errorMessage = 'Please provide both Contract ID and PDF URL';
            return;
        }

        this.isProcessing = true;
        this.errorMessage = '';
        this.extractionResults = null;

        try {
            const request: StartContractExtractionRequest = {
                contractId: this.contractId,
                pdfUrl: this.pdfUrl
            };

            const response: StartContractExtractionResponse = await this.startExtractionUseCase.execute(request);

            if (response.status === 'FAILED') {
                this.errorMessage = response.message;
            } else {
                // Get detailed results
                const resultsRequest: GetExtractionResultsRequest = {
                    extractionId: response.extractionId
                };

                this.extractionResults = await this.getExtractionResultsUseCase.execute(resultsRequest);

                if (!this.extractionResults) {
                    this.errorMessage = 'Failed to retrieve extraction results';
                }
            }

        } catch (error) {
            this.errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        } finally {
            this.isProcessing = false;
        }
    }
} 