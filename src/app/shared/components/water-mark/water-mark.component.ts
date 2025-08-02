import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';

@Component({
  selector: 'app-water-mark',
  templateUrl: './water-mark.component.html',
  styleUrls: ['./water-mark.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class WaterMarkComponent implements OnInit, AfterViewInit {
  @ViewChild('watermark', { static: false }) watermark!: ElementRef;
  @Input() text: string = '內部資料';
  @Input() fontSize: number = 16;
  @Input() color: string = 'rgba(0, 0, 0, 0.1)';

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const watermarkImg = this.createWatermark();
    this.watermark.nativeElement.style.backgroundImage = `url(${watermarkImg})`;
  }

  private createWatermark(): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    canvas.width = 200;
    canvas.height = 150;
    
    ctx.rotate(-Math.PI / 6);
    ctx.font = `${this.fontSize}px Arial`;
    ctx.fillStyle = this.color;
    ctx.textAlign = 'center';
    ctx.fillText(this.text, 50, 80);
    
    return canvas.toDataURL();
  }
}