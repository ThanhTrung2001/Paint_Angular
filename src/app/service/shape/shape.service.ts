import { Injectable } from '@angular/core';
import { SelectedRect } from 'src/app/model/selectedRect';
import { Shape } from 'src/app/model/shape';

@Injectable({
  providedIn: 'root'
})
export class ShapeService {
  public context!: CanvasRenderingContext2D;
  //shape
  public shape: string = '';
  public isRectangle: string = 'rectangle';
  public isCircle: string = 'circle';
  public isTriangle: string = 'triangle';
  public isLine: string = 'line';
  //fill
  public isFilled: boolean = false;
  //coordinates
  public lastX: number = 0;
  public lastY: number = 0;
  //for rectangle
  public width: number = 0;
  public height: number = 0;
  //shape array to check for fill color
  public shapes: Shape[] = [];
  public shapeItem = new Path2D();
  //select area
  public selectedRect:SelectedRect = {x:0,y:0,w:0,h:0};
  public existSelected:boolean = false;



  setShape(shape:string){
    this.shape = shape;
  }

  //check fill shape or not
  useFillShape(checked: boolean){
    this.isFilled = checked;
  }

  //draw shape
  drawShape(offsetX: number, offsetY:number){
    switch(this.shape)
      {
        case this.isRectangle:
          this.rectangleDraw();
          break;
        case this.isTriangle:
          this.triangleDraw(offsetX, offsetY);
          break;
        case this.isCircle:
          this.circleDraw();
          break;
        case this.isLine:
          this.lineDraw(offsetX, offsetY);
          break;
        default:
          this.selectArea();
          break;
      }
      this.context.stroke();
  }

  //draw shape
  saveShapeArea(offsetX: number, offsetY:number){
    const shapeDraw: Shape = {
      type: this.shape,
      filled: this.isFilled,
      shapeItem:this.shapeItem,
    };
    switch(this.shape){
        case this.isRectangle:
          this.rectangleDraw();
          this.updateShapeDraw(shapeDraw);
          break;
        case this.isTriangle:
          this.triangleDraw(offsetX, offsetY);
          this.updateShapeDraw(shapeDraw);
          break;
        case this.isCircle:
          this.circleDraw();
          this.updateShapeDraw(shapeDraw);
          break;
        case this.isLine:
          this.lineDraw(offsetX, offsetY);
          this.updateShapeDraw(shapeDraw);
          break;
        default:
          break;
      }
    this.addShape(shapeDraw);
    console.log(this.shapes);
  }

  //normal Draw
  normalDraw(offsetX: number, offsetY: number){
    this.context.moveTo(this.lastX, this.lastY);
    this.context.lineTo(offsetX, offsetY);
    this.context.stroke();
  }

  //shape draw
  //rectangle
  rectangleDraw(){
    this.context.rect(this.lastX, this.lastY,this.width, this.height);
    this.shapeItem.rect(this.lastX, this.lastY,this.width, this.height);
    if(this.isFilled == true)
    {
      this.context.fillRect(this.lastX, this.lastY,this.width, this.height);
      return;
    }
  }

  //circle
  circleDraw(){
    this.context.ellipse(this.lastX,this.lastY, Math.abs(this.width), Math.abs(this.height),0, 0, 2* Math.PI);
    this.shapeItem.ellipse(this.lastX,this.lastY, Math.abs(this.width), Math.abs(this.height),0, 0, 2* Math.PI);
    if(this.isFilled == true)
    {
      this.context.fill();
      return;
    }
  }

  //triangle
  triangleDraw(offsetX:number, offsetY:number){
    let middleTopX = this.lastX + this.width/2;
    let middleTopY = this.lastY;
    let leftTopX = this.lastX;
    let leftTopY = this.lastY + this.height;
    let rightTopX = this.lastX +this.width;
    let rightTopY = this.lastY+ this.height;
    //draw triangle
    this.context.moveTo(middleTopX, middleTopY);
    this.context.lineTo(rightTopX, rightTopY)
    this.context.lineTo(leftTopX, leftTopY);
    //draw shape in shapes array
    this.shapeItem.moveTo(middleTopX, middleTopY);
    this.shapeItem.lineTo(rightTopX, rightTopY)
    this.shapeItem.lineTo(leftTopX, leftTopY);
    this.context.closePath();
    if(this.isFilled == true)
    {
      this.context.fill();
      return;
    }
  }

  //line
  lineDraw(offsetX:number, offsetY:number){
    this.context.moveTo(this.lastX, this.lastY);
    this.context.lineTo(offsetX, offsetY);
    this.shapeItem.moveTo(this.lastX, this.lastY);
    this.shapeItem.lineTo(offsetX, offsetY);
  }

  updateShapeDraw(shapeDraw:Shape){
    shapeDraw.type = this.shape;
    shapeDraw.filled = this.isFilled;
    shapeDraw.shapeItem = this.shapeItem;
  }

  //add shape
  addShape(item:Shape){
    this.shapes.push(item);
  }

  //selectArea
  selectArea(){
    this.context.rect(this.lastX, this.lastY,this.width, this.height);
    this.context.setLineDash([5, 5]);
    this.context.stroke();
    this.context.setLineDash([]);
    this.selectedRect = {x:this.lastX, y:this.lastY, w:this.width, h:this.height};
    this.existSelected = true;
  }

}
