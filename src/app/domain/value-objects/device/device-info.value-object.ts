import { UserAgent } from './user-agent.value-object';

/**
 * 裝置資訊值物件
 */
export class DeviceInfo {
  private readonly userAgent: UserAgent;
  private readonly platform: string;
  private readonly screenSize: string;
  private readonly timezone: string;

  constructor(userAgent: string, platform: string, screenSize: string, timezone: string) {
    this.userAgent = new UserAgent(userAgent);
    this.platform = platform;
    this.screenSize = screenSize;
    this.timezone = timezone;
  }

  getUserAgent(): UserAgent {
    return this.userAgent;
  }

  getPlatform(): string {
    return this.platform;
  }

  getScreenSize(): string {
    return this.screenSize;
  }

  getTimezone(): string {
    return this.timezone;
  }

  static fromBrowser(): DeviceInfo {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const screenSize = `${screen.width}x${screen.height}`;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    return new DeviceInfo(userAgent, platform, screenSize, timezone);
  }
} 