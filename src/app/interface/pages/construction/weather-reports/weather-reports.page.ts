/**
 * @fileoverview 天氣報告頁面 (Weather Reports Page)
 * @author NG-AC Team
 * @version 1.0.0
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-weather-reports-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding:16px;">
      <h2>天氣報告</h2>
      <p>此為天氣報告頁面骨架。</p>
    </div>
  `
})
export class WeatherReportsPageComponent {}


