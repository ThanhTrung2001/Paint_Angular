import { AfterViewInit, Component,ElementRef, ViewChild, HostListener} from '@angular/core';
import { AppService } from './service/app/app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './app2.component.css']
})
export class AppComponent implements AfterViewInit{
  title = "paint";
  strokeColor:string = "#000";
  cursorClass:string = "";
  currentTool:string = 'pencil';
  currentShape:string = '';
  @ViewChild('paintCanvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  @HostListener('document:keydown.control.z', ['$event'])
  pressCtrlZ(event: KeyboardEvent) {
    // Add your desired functionality here
    this.rollback();
  }
  @HostListener('document:keydown.control.y', ['$event'])
  pressCtrlY(event: KeyboardEvent) {
    this.redo();
  }


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

  inkOrEyedrop(event:MouseEvent){
    switch(this.appService.getTool())
    {
      case 'ink':
        this.areaInk(event);
        break;
      case 'eyedropper':
        this.eyedropPicker(event);
        break;
      default:
        break;
    }
  }

  //eyedrop
  eyedropPicker(event: MouseEvent){
    this.appService.eyedropPicker(event);
    this.strokeColor = this.appService.strokeColor;
    
  }

  //ink
  areaInk(event: MouseEvent){
    this.appService.areaInk(event);
  }
  
  //color
  changeColor(event: any){
    this.appService.changecolor(event.target.value);
  }

  //lineWidth
  changeLineWidth(event: any){
    this.appService.changeLineWidth(event.target.value);
  }

  //zoom
  changeZoomScale(event: any){
    this.appService.changeZoomScale(event);
  }

  //pencil
  useTool(tool: string){
    // switch(tool){
    //   case 'pencil':
    //     this.cursorClass = "cursor-pencil";
    //     break;
    //   case 'eraser':
    //     this.cursorClass = "cursor-eraser";
    //     break;
    //   case 'ink':
    //     this.cursorClass = "cursor-ink";
    //     break;
    //   case 'text':
    //     this.cursorClass = "cursor-text";
    //     break;
    //   case 'eyedropper':
    //     this.cursorClass = "cursor-eyedrop";
    //     break;
    //   default:

    //     break;
    // }
    
    this.appService.useTool(tool);
    this.currentTool = tool;
    this.currentShape = '';
  }

  //shape
  setShape(shape:string){
    this.appService.setShape(shape);
    this.currentShape = shape;
    this.currentTool = '';
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
