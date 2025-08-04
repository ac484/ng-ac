/**
 * 使用者代理字串值物件
 */
export class UserAgent {
  private readonly value: string;
  private readonly browser: string;
  private readonly device: string;
  private readonly os: string;

  constructor(userAgent: string) {
    this.value = userAgent;
    const parsed = this.parseUserAgent(userAgent);
    this.browser = parsed.browser;
    this.device = parsed.device;
    this.os = parsed.os;
  }

  getValue(): string {
    return this.value;
  }

  getBrowser(): string {
    return this.browser;
  }

  getDevice(): string {
    return this.device;
  }

  getOS(): string {
    return this.os;
  }

  private parseUserAgent(userAgent: string): { browser: string; device: string; os: string } {
    // 簡化的 User Agent 解析
    let browser = 'Unknown';
    let device = 'Desktop';
    let os = 'Unknown';

    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';

    if (userAgent.includes('Mobile')) device = 'Mobile';
    else if (userAgent.includes('Tablet')) device = 'Tablet';

    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iOS')) os = 'iOS';

    return { browser, device, os };
  }
} 