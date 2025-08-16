/**
 * App Shell 工廠
 * 負責創建和管理 App Shell 實例
 *
 * @author NG-AC Team
 * @since 2024-12-19
 * @version 1.0.0
 */

import { AppShellEntity } from './app-shell.entity';

export class AppShellFactory {
  static create(id: string): AppShellEntity {
    return new AppShellEntity(id);
  }

  static createDefault(): AppShellEntity {
    return this.create('app-shell-default');
  }
}
