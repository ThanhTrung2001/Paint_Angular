import { Component,ElementRef, OnChanges, ViewChild} from '@angular/core';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  title = "paint";
  @ViewChild('paintCanvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  constructor(private appService: AppService) {}

  ngAfterViewInit() {
    const canvasElement = this.canvas.nativeElement;
    if (canvasElement) {
      const context = canvasElement.getContext('2d', { willReadFrequently: true });
      if (context) {
        const rect = canvasElement.getBoundingClientRect();
        canvasElement.width = rect.width;
        canvasElement.height = rect.height;
        this.appService.setContext(context);
      } else {
        console.error('Failed to get canvas context.');
      }
    } else {
      console.error('Canvas element not found.');
    }
  }

  startDrawing(event: MouseEvent) {
    this.appService.startDrawing(event);
  }

  draw(event: MouseEvent) {
    this.appService.draw(event);
  }

  stopDrawing() {
    this.appService.stopDrawing();
  }
  
  //color
  changeColor(event: any){
    this.appService.changecolor(event.target.value);
  }

  //lineWidth
  changeLineWidth(event: any){
    this.appService.changeLineWidth(event.target.value);
  }

  //pencil
  usePencil(){
    this.appService.usePencil();
  }

  //eraser
  useEraser(){
    this.appService.useEraser();
  }

  //shape
  useRectangle(){
    this.appService.useRectangle();
  }

  useCircle(){
    this.appService.useCircle();
  }

  useTriangle(){
    this.appService.useTriangle();
  }

  useLine(){
    this.appService.useLine();
  }

  //fill shape
  changeFill(event: any){
    this.appService.changeFill(event.target.checked);
  }


}
