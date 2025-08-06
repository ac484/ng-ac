import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmailServiceAdapter {
  sendEmail(to: string, subject: string, body: string): Promise<void> {
    console.log(`Sending email to ${to} with subject "${subject}"`);
    return Promise.resolve();
  }
}
