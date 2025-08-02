# Google Maps Integration Setup

This project has been updated to use Google Maps instead of AMap (高德地图) in the monitor component.

## Firebase 專案配置

由於這是 Firebase 專案，Google Maps API 已經直接整合，無需額外配置 API key。

### 自動配置

- ✅ **API Key**: 直接使用 Firebase 專案的 API key (`AIzaSyCmWn3NJBClxZeJHsg-eaEaqA3bdB9bzOQ`)
- ✅ **Maps JavaScript API**: 已啟用
- ✅ **Firebase 整合**: 自動配置

### 無需手動設置

~~不需要手動獲取 Google Maps API Key~~  
~~不需要修改環境變數~~  
~~不需要額外的 Google Cloud Console 配置~~

### 3. Features Included

- **Dark Theme**: Custom dark blue styling that matches the dashboard theme
- **Responsive Design**: Map adapts to different screen sizes
- **Angular Integration**: Uses @angular/google-maps for seamless Angular integration
- **Service Architecture**: GoogleMapsService handles API loading and initialization

### 4. Files Modified

- `ng-antd-admin-example/src/app/pages/dashboard/monitor/monitor.component.ts`
- `ng-antd-admin-example/src/app/pages/dashboard/monitor/monitor.component.html`
- `ng-antd-admin-example/src/app/pages/dashboard/monitor/monitor.component.less`
- `src/app/app.config.ts`
- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`

### 5. New Files Created

- `src/app/core/services/google-maps.service.ts` - Service for Google Maps initialization

### 6. Dependencies Added

- `@angular/google-maps` - Angular wrapper for Google Maps
- `@googlemaps/js-api-loader` - Google Maps JavaScript API loader

## Usage

The Google Maps component is now integrated into the monitor dashboard and will automatically load when the component initializes. The map features:

- Centered on Beijing (39.90923, 116.397428)
- Zoom level 2 for global view
- Dark theme styling to match the dashboard
- Responsive design

## Troubleshooting

1. **Map not loading**: Check that your API key is valid and the Maps JavaScript API is enabled
2. **Console errors**: Ensure the API key is properly configured in the environment files
3. **Styling issues**: The map uses custom dark styling - modify `mapOptions.styles` in the component if needed

## Security Notes

- Always restrict your API key to specific domains in production
- Consider setting up billing alerts in Google Cloud Console
- Monitor API usage to avoid unexpected charges