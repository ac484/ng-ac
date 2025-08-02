import { FormArray, FormGroup } from '@angular/forms';

import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { silentEvent } from 'ng-zorro-antd/core/util';

/*獲取1到100之間的隨機整數 this.randomNum(1,101)*/
const fnGetRandomNum = function getRandomNum(m: number, n: number): number {
  let num = Math.floor(Math.random() * (m - n) + n);
  return num;
};

const fnGetFile = function getFile(url: string, isBlob = false): Promise<NzSafeAny> {
  return new Promise((resolve, reject) => {
    const client = new XMLHttpRequest();
    client.responseType = isBlob ? 'blob' : '';
    client.onreadystatechange = () => {
      if (client.readyState !== 4) {
        return;
      }
      if (client.status === 200) {
        const urlArr = client.responseURL.split('/');
        resolve({
          data: client.response,
          url: urlArr[urlArr.length - 1]
        });
      } else {
        reject(new Error(client.statusText));
      }
    };
    client.open('GET', url);
    client.send();
  });
};

const fnCheckForm = function checkForm(form: FormGroup): boolean {
  Object.keys(form.controls).forEach(key => {
    form.controls[key].markAsDirty();
    form.controls[key].updateValueAndValidity();
  });
  return !form.invalid;
};

// 清空formArray
const fnClearFormArray = function clearFormArray(formArray: FormArray): void {
  while (formArray.length !== 0) {
    formArray.removeAt(0);
  }
};

const fnStopMouseEvent = function stopMouseEvent(e: MouseEvent): void {
  silentEvent(e);
};

// 數組對象去重
const fnRemoveDouble = function removeDouble<T>(list: NzSafeAny[], col: NzSafeAny): T {
  const obj = {};
  return list.reduce((cur, next) => {
    // @ts-ignore
    obj[next[col]] ? '' : (obj[next[col]] = true && cur.push(next));
    return cur;
  }, []);
};

// 獲取沒有參數的路由
const fnGetPathWithoutParam = function getPathWithoutParam(path: string): string {
  const paramIndex = path.indexOf('?');
  if (paramIndex > -1) {
    return path.substring(0, paramIndex);
  }
  return path;
};

// 返回uuid
const fnGetUUID = function getUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const fnGetBase64 = function getBase64(file: File): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

// weak-theme 轉換為 weakTheme
const fnFormatToHump = function formatToHump(value: string): string {
  return value.replace(/\-(\w)/g, (_, letter) => letter.toUpperCase());
};

// 格式化文件大小
const fnFormatFileSize = function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 深拷貝
const fnDeepCopy = function deepCopy<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (obj instanceof Array) return obj.map(item => fnDeepCopy(item)) as unknown as T;
  if (typeof obj === 'object') {
    const copy = {} as { [key: string]: any };
    Object.keys(obj).forEach(key => {
      copy[key] = fnDeepCopy((obj as { [key: string]: any })[key]);
    });
    return copy as T;
  }
  return obj;
};

export {
  fnFormatToHump,
  fnGetPathWithoutParam,
  fnGetFile,
  fnClearFormArray,
  fnCheckForm,
  fnStopMouseEvent,
  fnRemoveDouble,
  fnGetRandomNum,
  fnGetUUID,
  fnGetBase64,
  fnFormatFileSize,
  fnDeepCopy
};