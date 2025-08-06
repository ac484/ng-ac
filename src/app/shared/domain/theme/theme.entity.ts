import { BaseEntity } from '../base-entity';

export type ThemeType = 'light' | 'dark';
export type ThemeMode = 'side' | 'top' | 'mixin';
export type SpecialTheme = 'color-weak' | 'grey-theme';

export interface ThemeSettings {
    theme: ThemeType;
    color: string;
    mode: ThemeMode;
    colorWeak: boolean;
    greyTheme: boolean;
    fixedHead: boolean;
    splitNav: boolean;
    fixedLeftNav: boolean;
    isShowTab: boolean;
    fixedTab: boolean;
    hasTopArea: boolean;
    hasFooterArea: boolean;
    hasNavArea: boolean;
    hasNavHeadArea: boolean;
}

export class Theme extends BaseEntity<string> {
    private _settings: ThemeSettings;

    constructor(settings: Partial<ThemeSettings> = {}) {
        super('theme'); // 使用固定ID
        this._settings = {
            theme: 'light',
            color: '#1890FF',
            mode: 'side',
            colorWeak: false,
            greyTheme: false,
            fixedHead: true,
            splitNav: false,
            fixedLeftNav: true,
            isShowTab: true,
            fixedTab: true,
            hasTopArea: true,
            hasFooterArea: true,
            hasNavArea: true,
            hasNavHeadArea: true,
            ...settings
        };
    }

    get settings(): ThemeSettings {
        return { ...this._settings };
    }

    get isDarkTheme(): boolean {
        return this._settings.theme === 'dark';
    }

    get primaryColor(): string {
        return this._settings.color;
    }

    get navigationMode(): ThemeMode {
        return this._settings.mode;
    }

    // 業務規則：切換主題
    toggleTheme(): void {
        this._settings.theme = this._settings.theme === 'light' ? 'dark' : 'light';
        this.updateTimestamp();
    }

    // 業務規則：更新主色調
    updatePrimaryColor(color: string): void {
        if (!this.isValidColor(color)) {
            throw new Error('Invalid color format');
        }
        this._settings.color = color;
        this.updateTimestamp();
    }

    // 業務規則：更新導航模式
    updateNavigationMode(mode: ThemeMode): void {
        this._settings.mode = mode;
        this.updateTimestamp();
    }

    // 業務規則：切換特殊主題
    toggleSpecialTheme(type: 'colorWeak' | 'greyTheme'): void {
        this._settings[type] = !this._settings[type];
        this.updateTimestamp();
    }

    // 業務規則：更新佈局設置
    updateLayoutSetting(key: keyof ThemeSettings, value: boolean): void {
        if (typeof this._settings[key] === 'boolean') {
            (this._settings as any)[key] = value;
            this.updateTimestamp();
        }
    }

    // 驗證規則
    private isValidColor(color: string): boolean {
        return /^#[0-9A-F]{6}$/i.test(color);
    }

    // 重置為默認設置
    resetToDefault(): void {
        this._settings = {
            theme: 'light',
            color: '#1890FF',
            mode: 'side',
            colorWeak: false,
            greyTheme: false,
            fixedHead: true,
            splitNav: false,
            fixedLeftNav: true,
            isShowTab: true,
            fixedTab: true,
            hasTopArea: true,
            hasFooterArea: true,
            hasNavArea: true,
            hasNavHeadArea: true
        };
        this.updateTimestamp();
    }
} 