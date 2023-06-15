import { TestBed } from '@angular/core/testing';

import { ToolService } from './tool.service';

describe('ToolService', () => {
  let toolService: ToolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    toolService = TestBed.inject(ToolService);
  });

  it('should be change selectedTool to eraser', () => {
    const tool = 'eraser';
    toolService.useTool(tool);
    expect(toolService.selectedTool).toBe(tool);
  });

  it('should convert RGB pixel data to hexadecimal', () => {
    const pixelData = [255, 0, 0]; // Red
    const hexColor = toolService.rgpToHex(pixelData);
    expect(hexColor).toBe('#ff0000');
  });



});
