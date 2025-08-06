import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsAdapter {
  constructor() {}

  trackEvent(eventName: string, eventProperties: any): void {
    console.log(`Tracking event: ${eventName}`, eventProperties);
  }
}
