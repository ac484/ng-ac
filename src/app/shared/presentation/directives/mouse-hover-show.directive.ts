import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[appMouseHoverShow]',
    standalone: true
})
export class MouseHoverShowDirective {
    @Input() appMouseHoverShow = true;

    constructor(private el: ElementRef) { }

    @HostListener('mouseenter')
    onMouseEnter(): void {
        if (this.appMouseHoverShow) {
            this.el.nativeElement.querySelector('i')?.classList.remove('none');
        }
    }

    @HostListener('mouseleave')
    onMouseLeave(): void {
        if (this.appMouseHoverShow) {
            this.el.nativeElement.querySelector('i')?.classList.add('none');
        }
    }
}

