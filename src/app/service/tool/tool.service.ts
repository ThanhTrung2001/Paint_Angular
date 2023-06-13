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
  public isEyeDropper: string = 'eyedropper';

  useTool(tool: string){
    this.selectedTool = tool;
  }

  rgpToHex(pixelData: ImageData["data"]){
    const r = pixelData[0];
    const g = pixelData[1];
    const b = pixelData[2];
    const componentToHex = (x: number) => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };
    return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
  }
}
