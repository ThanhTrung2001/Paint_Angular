export interface Shape{
  // type: 'line' | 'rectangle' | 'triangle' | 'circle';
  type:string;
  x:number;
  y:number; 
  w:number;
  h:number;
  color: string;
  fill: boolean;
}