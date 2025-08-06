import { Theme } from './theme.entity';

export abstract class ThemeRepository {
  abstract getCurrentTheme(): Promise<Theme>;
  abstract saveTheme(theme: Theme): Promise<void>;
  abstract deleteTheme(): Promise<void>;
} 