import { TestBed } from '@angular/core/testing';

import { SnapshotService } from './snapshot.service';

describe('SnapshotService', () => {
  let snapshotService: SnapshotService;
  let context: CanvasRenderingContext2D;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    snapshotService = TestBed.inject(SnapshotService);

    // Canvas context mocking
    const canvas = document.createElement('canvas');
    context = canvas.getContext('2d') as CanvasRenderingContext2D;
    context.canvas.width = 300;
    context.canvas.height = 150;
    snapshotService.context = context;
  });

  it('should save a snapshot', () => {
    const getImageDataSpy = spyOn(context, 'getImageData');
    const snapshotItem = new ImageData(1,1);
    getImageDataSpy.and.returnValue(snapshotItem);

    snapshotService.saveSnapshot();

    expect(snapshotService.snapshotHistory.length).toBe(1);
    expect(snapshotService.snapshotHistory[0]).toBe(snapshotItem);
  });

  it('should rollback to the closest snapshot', () => {
    const snapshotItem1 = new ImageData(1, 1);
    const snapshotItem2 = new ImageData(1, 1);
    snapshotService.snapshotHistory.push(snapshotItem1, snapshotItem2);

    spyOn(context, 'putImageData');

    snapshotService.rollback();

    expect(snapshotService.snapshotHistory.length).toBe(1);
    expect(snapshotService.snapshotHistory).toContain(snapshotItem1);
  });

  it('should clear the canvas if no more snapshots exist during rollback', () => {
    spyOn(context, 'clearRect');
    if(snapshotService.snapshotHistory.length > 0)
    {
      snapshotService.rollback();
    }

    expect(snapshotService.snapshotHistory.length).toBe(0);
  });

  it('should redo the snapshot', () => {
    const snapshotItem1 = new ImageData(1, 1);
    const snapshotItem2 = new ImageData(1, 1);
    snapshotService.snapshotRedo.push(snapshotItem1, snapshotItem2);

    spyOn(context, 'putImageData');

    snapshotService.redo();

    expect(snapshotService.snapshotRedo.length).toBe(1);
    expect(snapshotService.snapshotRedo).toContain(snapshotItem1);
  });

  it('should not redo if no more redo snapshots exist', () => {
    spyOn(context, 'putImageData');

    snapshotService.redo();

    expect(snapshotService.snapshotRedo.length).toBe(0);
    expect(context.putImageData).not.toHaveBeenCalled();
  });
});
