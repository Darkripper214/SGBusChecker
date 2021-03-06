import {
  AfterViewInit,
  Component,
  ElementRef,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { LoaderService } from './service/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  title = 'busChecker';
  @ViewChild('loader') loader: ElementRef;
  @ViewChild('overlay') overlay: ElementRef;
  constructor(
    private loaderService: LoaderService,
    private renderer: Renderer2
  ) {}

  ngAfterViewInit() {
    // Loader Activation via HTTP interceptor
    this.loaderService.httpProgress().subscribe((status: boolean) => {
      // Short circuit for main page
      // To use wrapper in future implementation
      if (window.origin + '/' === window.location.href) {
        return;
      }
      if (status) {
        this.renderer.addClass(this.loader.nativeElement, 'loader');
        this.renderer.addClass(this.overlay.nativeElement, 'overlay-color');
      } else {
        this.renderer.removeClass(this.loader.nativeElement, 'loader');
        this.renderer.removeClass(this.overlay.nativeElement, 'overlay-color');
      }
    });
  }
}
