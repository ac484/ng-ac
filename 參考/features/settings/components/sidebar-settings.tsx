'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { IconChevronDown, IconChevronRight, IconDeviceFloppy, IconEye, IconEyeOff, IconRotate } from '@tabler/icons-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useSettingsContext } from '../context/settings-context';
import { SidebarItemSettings } from '../types';

interface SidebarSettingsProps {
  className?: string;
}

export function SidebarSettings({ className }: SidebarSettingsProps) {
  const { state, updateSidebarVisibility, saveSettings, resetToDefaults } = useSettingsContext();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [hasChanges, setHasChanges] = useState(false);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleVisibilityChange = (itemId: string, isVisible: boolean) => {
    updateSidebarVisibility(itemId, isVisible);
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      await saveSettings();
      setHasChanges(false);
      toast.success('設置已保存');
    } catch (error) {
      toast.error('保存設置失敗');
    }
  };

  const handleReset = () => {
    resetToDefaults();
    setHasChanges(false);
    toast.success('已重置為默認設置');
  };

  const renderSidebarItem = (item: SidebarItemSettings, level: number = 0) => {
    const isExpanded = expandedItems.has(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const visibleChildren = hasChildren ? item.children!.filter(child => child.isVisible) : [];

    return (
      <div key={item.id} className="space-y-2">
        <div
          className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
            item.isVisible
              ? 'bg-background border-border'
              : 'bg-muted/50 border-muted'
          }`}
          style={{ marginLeft: `${level * 20}px` }}
        >
          <div className="flex items-center space-x-3 flex-1">
            {hasChildren && (
              <button
                onClick={() => toggleExpanded(item.id)}
                className="p-1 hover:bg-accent rounded transition-colors"
              >
                {isExpanded ? (
                  <IconChevronDown className="h-4 w-4" />
                ) : (
                  <IconChevronRight className="h-4 w-4" />
                )}
              </button>
            )}

            <div className="flex items-center space-x-2">
              {item.isVisible ? (
                <IconEye className="h-4 w-4 text-green-600" />
              ) : (
                <IconEyeOff className="h-4 w-4 text-muted-foreground" />
              )}
              <span className={`font-medium ${!item.isVisible ? 'text-muted-foreground' : ''}`}>
                {item.title}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id={`visibility-${item.id}`}
              checked={item.isVisible}
              onCheckedChange={(checked) => handleVisibilityChange(item.id, checked)}
            />
            <Label htmlFor={`visibility-${item.id}`} className="sr-only">
              {item.isVisible ? '隱藏' : '顯示'} {item.title}
            </Label>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="space-y-2">
            {visibleChildren.length > 0 ? (
              visibleChildren.map(child => renderSidebarItem(child, level + 1))
            ) : (
              <div
                className="text-sm text-muted-foreground italic p-2"
                style={{ marginLeft: `${(level + 1) * 20}px` }}
              >
                沒有可見的子項目
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <IconEye className="h-5 w-5" />
          <span>側邊欄顯示設置</span>
        </CardTitle>
        <CardDescription>
          控制側邊欄中顯示哪些功能模組和頁面
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          {state.sidebarSettings.items.map(item => renderSidebarItem(item))}
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {hasChanges && '有未保存的更改'}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex items-center space-x-2"
            >
              <IconRotate className="h-4 w-4" />
              <span>重置</span>
            </Button>

            <Button
              onClick={handleSave}
              disabled={!hasChanges || state.isLoading}
              className="flex items-center space-x-2"
            >
              <IconDeviceFloppy className="h-4 w-4" />
              <span>{state.isLoading ? '保存中...' : '保存設置'}</span>
            </Button>
          </div>
        </div>

        {state.error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{state.error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
