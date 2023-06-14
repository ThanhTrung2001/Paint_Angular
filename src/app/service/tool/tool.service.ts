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

  hexToRGB(fillColor: string): number[] {
    // Remove the leading '#' if present
    const hex = fillColor.replace('#', '');
  
    // Extract the individual color components
    const red = parseInt(hex.substr(0, 2), 16);
    const green = parseInt(hex.substr(2, 2), 16);
    const blue = parseInt(hex.substr(4, 2), 16);
  
    // Return the RGB color components as an array
    return [red, green, blue];
  }
  
}
