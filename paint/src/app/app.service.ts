import { Injectable } from '@angular/core';
import { ShapeService } from './service/shape.service';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private context!: CanvasRenderingContext2D;
  //pen & eraser
  private isDrawing: boolean = false;
  private isPencil: boolean = true;
  private isEraser: boolean = false;
  private isInk: boolean = false;
  //coordinates
  private lastX: number = 0;
  private lastY: number = 0;
  //stroke & line width
  private strokeColor: string = "#000";
  private lineWidth: number = 1;
  //snapshot for shape draw
  private snapshot: any;
  //for rectangle
  private width: number = 0;
  private height: number = 0;
  //for circle
  private radius: number = 0;

  constructor(private shapeService: ShapeService){}

  //set context for canvas
  setContext(context: CanvasRenderingContext2D) {
    this.context = context;
  }

  //Start draw, get the current position when mouse down
  startDrawing(event: MouseEvent) {
    this.isDrawing = true;
    const canvasRect = this.context.canvas.getBoundingClientRect();
    const offsetX = (event.clientX - canvasRect.left);
    const offsetY = (event.clientY - canvasRect.top);
    this.lastX = offsetX;
    this.lastY = offsetY;
    this.width = 0;
    this.height = 0;
    this.snapshot = this.context.getImageData(0,0, canvasRect.width, canvasRect.height);
  }

  //Drawing, get current mouse position eachtime and connect old point to new point
  draw(event: MouseEvent) {
    if (!this.isDrawing) return;
    const canvasRect = this.context.canvas.getBoundingClientRect();
    //get the current mouse coordinates
    const offsetX = (event.clientX - canvasRect.left);
    const offsetY = (event.clientY - canvasRect.top);
    //this is for shape
    //1.rectangle width & height
    this.width = offsetX - this.lastX;
    this.height = offsetY- this.lastY;
    //2.circle radius
    this.radius = Math.sqrt((offsetX - this.lastX)**2 + (offsetY - this.lastY)**2);
    //Check if eraser
    if (this.isEraser) {
      // Use globalCompositeOperation to erase instead of drawing -> delete
      this.context.globalCompositeOperation = 'destination-out';
    } else {
      //use Pen
      this.context.strokeStyle = this.strokeColor;
      this.context.globalCompositeOperation = 'source-over';
    }
    //custom stroke
    this.context.lineJoin = 'round';
    this.context.lineCap = 'round';
    this.context.lineWidth = this.lineWidth;
    this.context.fillStyle = this.strokeColor;
    this.context.beginPath();
    //start draw line
    if(this.isPencil == false)
    {
      this.context.putImageData(this.snapshot, 0 , 0); 
      if(this.shapeService.isRectangle == true)
      {
        this.rectangleDraw();
      }
      if(this.shapeService.isCircle == true)
      {
        this.circleDraw();
      }
      if(this.shapeService.isTriangle == true)
      {
        this.triangleDraw(offsetX, offsetY);
      }
      if(this.shapeService.isLine == true)
      {
        this.lineDraw(offsetX, offsetY);
      }
    }
    else
    {
      this.normalDraw(offsetX, offsetY);
      //set lastposition again (with shape -> not draw continuous -> no nedd to set last position like normal draw)
      this.lastX = offsetX;
      this.lastY = offsetY;
    }
    
  }

  stopDrawing() {
    this.isDrawing = false;
  }

  //normalDraw
  normalDraw(offsetX: any, offsetY: any){
    this.context.moveTo(this.lastX, this.lastY);
    this.context.lineTo(offsetX, offsetY);
    this.context.stroke();
  }

  //shape draw
  //rectangle
  rectangleDraw(){
    this.context.rect(this.lastX, this.lastY,this.width, this.height);
    if(this.shapeService.isFilled == true)
    {
      this.context.fill();
      return;
    }
    this.context.stroke();
  }

  //circle
  circleDraw(){
    this.context.arc(this.lastX,this.lastY, this.radius, 0, 2* Math.PI);
    if(this.shapeService.isFilled == true)
    {
      this.context.fill();
      return;
    }
    this.context.stroke();
  }

  triangleDraw(offsetX:number, offsetY:number){
    this.context.moveTo(this.lastX, this.lastY);
    this.context.lineTo(offsetX, offsetY)
    this.context.lineTo(this.lastX*2 - offsetX, offsetY);
    this.context.closePath()
    if(this.shapeService.isFilled == true)
    {
      this.context.fill();
      return;
    }
    this.context.stroke();
  }

  lineDraw(offsetX:number, offsetY:number){
    this.context.moveTo(this.lastX, this.lastY);
    this.context.lineTo(offsetX, offsetY)
    this.context.stroke();
  }

  //color & stroke line width
  changecolor(color: string){
    this.strokeColor = color;
  }

  changeLineWidth(width: number){
    this.lineWidth = width;
  }

  //pencil
  usePencil(){
    this.isPencil = !this.isPencil;
  }

  //eraser
  useEraser(){
    this.isEraser = !this.isEraser;
  }

  //shape
  useRectangle(){
    this.shapeService.useRectangle();
  }

  useCircle(){
    this.shapeService.useCircle();
  }

  useTriangle(){
    this.shapeService.useTriangle();
  }

  useLine(){
    this.shapeService.useLine();
  }

  changeFill(checked: boolean)
  {
    this.shapeService.useFillShape(checked);
  }

  
}
