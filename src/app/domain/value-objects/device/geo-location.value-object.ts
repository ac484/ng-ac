/**
 * IP 解析之地理位置值物件
 */
export class GeoLocation {
  private readonly city: string;
  private readonly country: string;
  private readonly latitude: number;
  private readonly longitude: number;

  constructor(city: string, country: string, latitude: number, longitude: number) {
    this.city = city;
    this.country = country;
    this.latitude = latitude;
    this.longitude = longitude;
  }

  getCity(): string {
    return this.city;
  }

  getCountry(): string {
    return this.country;
  }

  getLatitude(): number {
    return this.latitude;
  }

  getLongitude(): number {
    return this.longitude;
  }

  getCoordinates(): { lat: number; lng: number } {
    return { lat: this.latitude, lng: this.longitude };
  }

  static fromIP(ip: string): Promise<GeoLocation> {
    // 實際實現中應調用地理位置 API
    return Promise.resolve(new GeoLocation('Unknown', 'Unknown', 0, 0));
  }
} 