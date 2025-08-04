import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'status'
})
export class StatusPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'ACTIVE':
        return '啟用';
      case 'INACTIVE':
        return '停用';
      case 'PENDING':
        return '待審核';
      case 'SUSPENDED':
        return '暫停';
      case 'CLOSED':
        return '已關閉';
      default:
        return '未知';
    }
  }
}
