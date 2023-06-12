import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShapeService {
  //shape
  public isRectangle: boolean = false;
  public isCircle: boolean = false;
  public isTriangle: boolean = false;
  public isLine: boolean = false;
  public isFilled: boolean = false;

  //shape
  useRectangle()
  {
    this.isRectangle = !this.isRectangle;
  }

  useCircle()
  {
    this.isCircle = !this.isCircle;
  }

  useTriangle()
  {
    this.isTriangle = !this.isTriangle;
  }

  useLine(){
    this.isLine = !this.isLine;
  }

  useFillShape(checked: boolean){
    this.isFilled = checked;
  }

}
