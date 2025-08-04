/**
 * Firebase UID 值物件
 */
export class FirebaseUid {
  private readonly value: string;

  constructor(uid: string) {
    if (!uid || uid.trim().length === 0) {
      throw new Error('Firebase UID cannot be empty');
    }
    this.value = uid.trim();
  }

  getValue(): string {
    return this.value;
  }

  static fromFirebaseUser(user: any): FirebaseUid {
    if (!user || !user.uid) {
      throw new Error('Firebase user must have UID');
    }
    return new FirebaseUid(user.uid);
  }
}
