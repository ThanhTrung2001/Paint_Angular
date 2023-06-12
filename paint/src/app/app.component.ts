import { AfterViewInit, Component,ElementRef, ViewChild} from '@angular/core';
import { AppService } from './service/app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit{
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
        context.fillStyle = "#fff";
        context.fillRect(0,0,rect.width, rect.height);
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

  outRangeDraw() {
    this.appService.outRange();
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

  //clear all
  clearAll(){
    this.appService.clearAll();
  }

  //Save
  saveImage(){
    this.appService.saveImage();
  }

  //snapshot function
  rollback(){
    this.appService.rollback();
  }
  
  redo(){
    this.appService.redo();
  }

  //Load
  loadImage(event: any){
    this.appService.loadImage(event);
  }


}
