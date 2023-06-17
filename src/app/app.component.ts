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
  currentMouseX:number = 0;
  currentMouseY:number = 0;
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

  @HostListener('document:keydown.control.x', ['$event'])
  pressCtrlX(event: KeyboardEvent) {
    // Add your desired functionality here
    this.cutSelected();
  }


  @HostListener('document:keydown.control.c', ['$event'])
  pressCtrlC(event: KeyboardEvent) {
    // Add your desired functionality here
    this.copySelected();
  }
  @HostListener('document:keydown.control.v', ['$event'])
  pressCtrlV(event: KeyboardEvent) {
    this.pasteSelected();
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
    this.appService.draw(event, '');
    this.currentMouseX = this.appService.offsetX;
    this.currentMouseY = this.appService.offsetY;
  }

  stopDrawing() {
    this.appService.stopDrawing();
  }

  outRangeDraw() {
    this.appService.outRange();
    this.currentMouseX = 0;
    this.currentMouseY = 0;
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

  //rotate
  rotate(rotateDegree:number){
    this.appService.rotate(rotateDegree);
  }

  //flip
  flip(isHorizontal:boolean, isVertical:boolean){
    this.appService.flip(isHorizontal, isVertical);
  }

  copySelected(){
    this.appService.copySelected();
  }

  cutSelected(){
    this.appService.cutSelected();
  }

  pasteSelected(){
    this.appService.pasteSelected();
  }

}
