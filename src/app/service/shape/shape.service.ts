import { Injectable } from '@angular/core';

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
  //for circle
  public radius: number = 0;

  //shape
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
          break;
      }
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
    if(this.isFilled == true)
    {
      this.context.fill();
      return;
    }
    this.context.stroke();
  }

  //circle
  circleDraw(){
    this.context.arc(this.lastX,this.lastY, this.radius, 0, 2* Math.PI);
    if(this.isFilled == true)
    {
      this.context.fill();
      return;
    }
    this.context.stroke();
  }

  //triangle
  triangleDraw(offsetX:number, offsetY:number){
    this.context.moveTo(this.lastX, this.lastY);
    this.context.lineTo(offsetX, offsetY)
    this.context.lineTo(this.lastX*2 - offsetX, offsetY);
    this.context.closePath()
    if(this.isFilled == true)
    {
      this.context.fill();
      return;
    }
    this.context.stroke();
  }

  //line
  lineDraw(offsetX:number, offsetY:number){
    this.context.moveTo(this.lastX, this.lastY);
    this.context.lineTo(offsetX, offsetY)
    this.context.stroke();
  }

  

}
