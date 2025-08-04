/**
 * 頭像網址值物件
 */
export class PhotoUrl {
  private readonly value: string | null;

  constructor(photoUrl: string | null) {
    if (photoUrl === null || photoUrl === undefined) {
      this.value = null;
    } else {
      const trimmed = photoUrl.trim();
      if (trimmed.length > 0 && this.isValidUrl(trimmed)) {
        this.value = trimmed;
      } else {
        this.value = null;
      }
    }
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  getValue(): string | null {
    return this.value;
  }

  hasPhoto(): boolean {
    return this.value !== null;
  }
}
