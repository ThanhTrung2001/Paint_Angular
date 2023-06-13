import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToolService {
  public selectedTool: string = 'pencil';
  public isPencil: string = 'pencil';
  public isEraser: string = 'eraser';
  public isInk: string = 'ink';
  public isTextArea: string = 'text'; 

  useTool(tool: string){
    this.selectedTool = tool;
  }
}
