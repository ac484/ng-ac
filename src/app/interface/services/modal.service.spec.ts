/**
 * 統一模態框服務測試
 */

import { TestBed } from '@angular/core/testing';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

import { ModalService } from './modal.service';

describe('ModalService', () => {
  let service: ModalService;
  let nzModalService: jasmine.SpyObj<NzModalService>;
  let messageService: jasmine.SpyObj<NzMessageService>;

  beforeEach(() => {
    const nzModalSpy = jasmine.createSpyObj('NzModalService', ['confirm', 'info', 'create', 'closeAll']);
    const messageSpy = jasmine.createSpyObj('NzMessageService', ['success', 'error', 'warning', 'info']);

    TestBed.configureTestingModule({
      providers: [ModalService, { provide: NzModalService, useValue: nzModalSpy }, { provide: NzMessageService, useValue: messageSpy }]
    });

    service = TestBed.inject(ModalService);
    nzModalService = TestBed.inject(NzModalService) as jasmine.SpyObj<NzModalService>;
    messageService = TestBed.inject(NzMessageService) as jasmine.SpyObj<NzMessageService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('confirm', () => {
    it('should call nzModalService.confirm with correct parameters', async () => {
      const mockModal = {
        afterClose: jasmine.createSpy().and.returnValue(Promise.resolve(true))
      } as any;
      nzModalService.confirm.and.returnValue(mockModal);

      const options = {
        title: 'Confirm Title',
        content: 'Confirm Content',
        okText: 'OK',
        cancelText: 'Cancel'
      };

      const result = await service.confirm(options);

      expect(nzModalService.confirm).toHaveBeenCalledWith(
        jasmine.objectContaining({
          nzTitle: options.title,
          nzContent: options.content,
          nzOkText: options.okText,
          nzCancelText: options.cancelText
        })
      );
      expect(result).toBe(true);
    });
  });

  describe('openForm', () => {
    it('should create form modal', () => {
      const mockModalRef = {
        afterClose: jasmine.createSpy().and.returnValue(Promise.resolve())
      } as any;
      nzModalService.create.and.returnValue(mockModalRef);

      const options = {
        title: 'Form Title',
        component: {} as any,
        data: { test: 'data' }
      };

      const result = service.openForm(options);

      expect(nzModalService.create).toHaveBeenCalledWith(
        jasmine.objectContaining({
          nzTitle: 'Form Title',
          nzContent: options.component,
          nzWidth: 600
        })
      );
      expect(result).toBe(mockModalRef);
    });
  });

  describe('openCustom', () => {
    it('should create custom modal', () => {
      const mockModalRef = {
        afterClose: jasmine.createSpy().and.returnValue(Promise.resolve())
      } as any;
      nzModalService.create.and.returnValue(mockModalRef);

      const options = {
        title: 'Custom Title',
        content: {} as any,
        width: 800,
        data: { custom: 'data' }
      };

      const result = service.openCustom(options);

      expect(nzModalService.create).toHaveBeenCalledWith(
        jasmine.objectContaining({
          nzTitle: 'Custom Title',
          nzContent: options.content,
          nzWidth: 800
        })
      );
      expect(result).toBe(mockModalRef);
    });
  });

  describe('success', () => {
    it('should show success dialog', async () => {
      const title = 'Success';
      const content = 'Operation completed successfully';

      await service.success(title, content);

      expect(nzModalService.info).toHaveBeenCalledWith(
        jasmine.objectContaining({
          nzTitle: title,
          nzContent: content,
          nzIconType: 'check-circle'
        })
      );
    });
  });

  describe('error', () => {
    it('should show error dialog', async () => {
      const title = 'Error';
      const content = 'Operation failed';

      await service.error(title, content);

      expect(nzModalService.info).toHaveBeenCalledWith(
        jasmine.objectContaining({
          nzTitle: title,
          nzContent: content,
          nzIconType: 'close-circle'
        })
      );
    });
  });

  describe('warning', () => {
    it('should show warning dialog', async () => {
      const title = 'Warning';
      const content = 'Please be careful';

      await service.warning(title, content);

      expect(nzModalService.info).toHaveBeenCalledWith(
        jasmine.objectContaining({
          nzTitle: title,
          nzContent: content,
          nzIconType: 'exclamation-circle'
        })
      );
    });
  });

  describe('closeAll', () => {
    it('should close all modals', () => {
      service.closeAll();

      expect(nzModalService.closeAll).toHaveBeenCalled();
    });
  });
});
