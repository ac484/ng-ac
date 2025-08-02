import { Injectable } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {
  private loader: Loader;
  private isLoaded = false;

  constructor() {
    // Firebase 專案可以使用 Firebase 的 API key 或直接使用公開的 Maps API
    this.loader = new Loader({
      apiKey: 'AIzaSyCmWn3NJBClxZeJHsg-eaEaqA3bdB9bzOQ', // 使用 Firebase 專案的 API key
      version: 'weekly',
      libraries: ['places', 'geometry']
    });
  }

  async loadGoogleMaps(): Promise<typeof google> {
    if (!this.isLoaded) {
      await this.loader.load();
      this.isLoaded = true;
    }
    return google;
  }

  isGoogleMapsLoaded(): boolean {
    return this.isLoaded && typeof google !== 'undefined';
  }
}