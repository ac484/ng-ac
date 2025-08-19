/**
 * @fileoverview 現代 DDD Result 類型 (Modern DDD Result Type)
 * @description 用於處理成功/失敗的操作結果，提供類型安全的錯誤處理
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2025-01-18
 *
 * 檔案性質：
 * - 類型：Shared Layer Result Type
 * - 職責：操作結果的類型安全處理
 * - 依賴：無外部依賴
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 */

export type Result<TPayload = any, TError = string, TMetaData = any> =
  | SuccessResult<TPayload, TError, TMetaData>
  | FailureResult<TPayload, TError, TMetaData>;

export class SuccessResult<TPayload, TError, TMetaData> {
  readonly _tag = 'Success' as const;
  readonly isSuccess = true;
  readonly isFailure = false;

  constructor(
    private readonly _value: TPayload,
    private readonly _metaData?: TMetaData
  ) {}

  value(): TPayload {
    return this._value;
  }

  metaData(): TMetaData | undefined {
    return this._metaData;
  }

  error(): TError | null {
    return null;
  }

  map<U>(fn: (value: TPayload) => U): Result<U, TError, TMetaData> {
    return Result.ok(fn(this._value), this._metaData);
  }

  flatMap<U>(fn: (value: TPayload) => Result<U, TError, TMetaData>): Result<U, TError, TMetaData> {
    return fn(this._value);
  }

  onSuccess(fn: (value: TPayload) => void): Result<TPayload, TError, TMetaData> {
    fn(this._value);
    return this;
  }

  onFailure(fn: (error: TError) => void): Result<TPayload, TError, TMetaData> {
    // Do nothing for success
    return this;
  }
}

export class FailureResult<TPayload, TError, TMetaData> {
  readonly _tag = 'Failure' as const;
  readonly isSuccess = false;
  readonly isFailure = true;

  constructor(
    private readonly _error: TError,
    private readonly _metaData?: TMetaData
  ) {}

  value(): TPayload | null {
    return null;
  }

  metaData(): TMetaData | undefined {
    return this._metaData;
  }

  error(): TError {
    return this._error;
  }

  map<U>(fn: (value: TPayload) => U): Result<U, TError, TMetaData> {
    return this as any;
  }

  flatMap<U>(fn: (value: TPayload) => Result<U, TError, TMetaData>): Result<U, TError, TMetaData> {
    return this as any;
  }

  onSuccess(fn: (value: TPayload) => void): Result<TPayload, TError, TMetaData> {
    // Do nothing for failure
    return this;
  }

  onFailure(fn: (error: TError) => void): Result<TPayload, TError, TMetaData> {
    fn(this._error);
    return this;
  }
}

export namespace Result {
  export function ok<TPayload, TError, TMetaData>(
    value: TPayload,
    metaData?: TMetaData
  ): Result<TPayload, TError, TMetaData> {
    return new SuccessResult(value, metaData);
  }

  export function fail<TPayload, TError, TMetaData>(
    error: TError,
    metaData?: TMetaData
  ): Result<TPayload, TError, TMetaData> {
    return new FailureResult(error, metaData);
  }

  export function combine<T extends readonly Result<any, any, any>[]>(
    results: T
  ): Result<
    { [K in keyof T]: T[K] extends Result<infer U, any, any> ? U : never },
    { [K in keyof T]: T[K] extends Result<any, infer E, any> ? E : never }[number]
  > {
    const values: any[] = [];

    for (const result of results) {
      if (result.isFailure) {
        return result as any;
      }
      values.push(result.value());
    }

    return Result.ok(values as any);
  }

  export function fromPromise<T>(
    promise: Promise<T>
  ): Promise<Result<T, Error>> {
    return promise
      .then(value => Result.ok(value))
      .catch(error => Result.fail(error instanceof Error ? error : new Error(String(error)));
  }
}

