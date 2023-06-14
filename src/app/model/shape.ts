export interface Shape{
  // type: 'line' | 'rectangle' | 'triangle' | 'circle';
  type:string;
  filled:boolean;
  shapeItem:Path2D;
}