import { DeviceInfo } from './device-info.value-object';
import { GeoLocation } from './geo-location.value-object';
import { LoginSource } from './login-source.value-object';

/**
 * 登入時上下文資訊值物件
 */
export class LoginContext {
  private readonly ip: string;
  private readonly timestamp: Date;
  private readonly deviceInfo: DeviceInfo;
  private readonly geoLocation: GeoLocation;
  private readonly source: LoginSource;

  constructor(ip: string, deviceInfo: DeviceInfo, geoLocation: GeoLocation, source: LoginSource) {
    this.ip = ip;
    this.timestamp = new Date();
    this.deviceInfo = deviceInfo;
    this.geoLocation = geoLocation;
    this.source = source;
  }

  getIP(): string {
    return this.ip;
  }

  getTimestamp(): Date {
    return new Date(this.timestamp);
  }

  getDeviceInfo(): DeviceInfo {
    return this.deviceInfo;
  }

  getGeoLocation(): GeoLocation {
    return this.geoLocation;
  }

  getSource(): LoginSource {
    return this.source;
  }
}
