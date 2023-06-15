import { TestBed } from '@angular/core/testing';

import { AppService } from './app.service';
import { ShapeService } from '../shape/shape.service';
import { ToolService } from '../tool/tool.service';
import { SnapshotService } from '../snapshot/snapshot.service';

describe('AppService', () => {
  let appService: AppService;
  let shapeService: ShapeService;
  let toolService: ToolService;
  let snapshotService: SnapshotService;

  beforeEach(() => {
    shapeService = new ShapeService();
    toolService = new ToolService();
    snapshotService = new SnapshotService();
    appService = new AppService(shapeService, toolService, snapshotService);
    appService.getContext = jasmine.createSpy().and.returnValue({
      canvas: {
        width: 500, // Set the canvas width
        height: 500 // Set the canvas height
      }
    } as unknown as CanvasRenderingContext2D);
  });

  it('should be created', () => {
    expect(appService).toBeTruthy();
  });

  it('should draw', () => {
    const event = new MouseEvent('mousemove');
    let IsDrawing :boolean = true;
    appService.changeDrawState(true);
    expect(appService.isDrawing).toBe(IsDrawing);
    // Add your expectations here
  });

  it('should stop draw', () => {
    let IsDrawing :boolean = false;
    appService.changeDrawState(false);
    expect(appService.isDrawing).toBe(IsDrawing);
    // Add your expectations here
  });

  it('should change stroke color', () => {
    let white :string = 'white';
    appService.changecolor('white');
    expect(appService.strokeColor).toBe(white);
    // Add your expectations here
  });

  it('should change line width', () => {
    let width :number = 2;
    appService.changeLineWidth(2);
    expect(appService.lineWidth).toBe(width);
    // Add your expectations here
  });

  it('should use tool, not shape', () => {
    let tool :string = 'pencil';
    appService.useTool('pencil')
    expect(appService.getTool()).toBe(tool);
    expect(appService.getTool()).toBe(tool);
    // Add your expectations here
  });

  it('should use shape, not tool', () => {
    let shape :string = 'rectangle';
    appService.setShape('rectangle');
    expect(appService.getShape()).toBe(shape);
    // Add your expectations here
  });

  it('should change fill shape or not', () => {
    const checked = true;
    spyOn(shapeService, 'useFillShape');
    appService.changeFill(checked);
    expect(shapeService.useFillShape).toHaveBeenCalledWith(checked);
  });

});
