import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SnapshotService {
  public context!: CanvasRenderingContext2D;
  //snapshot saving array
  public snapshotHistory: ImageData[] = [];
  public snapshotRedo: ImageData[] = [];

  //rollback
  rollback(){
    if (this.snapshotHistory.length > 0) {
      const latestSnapshot = this.snapshotHistory.pop(); //remove newest snapshot and ready to load closest snapshot 
      if(latestSnapshot)
      {
        this.snapshotRedo.push(latestSnapshot);
        if (this.snapshotHistory.length > 0) 
        {
          const closestSnapshot = this.snapshotHistory[this.snapshotHistory.length - 1];
          this.context.putImageData(closestSnapshot, 0, 0); // Load the closest snapshot
        } 
        else 
        {
          // If there are no more snapshots, clear the canvas
          this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        }
      }
    }
  }

  //redo
  redo(){
    if(this.snapshotRedo.length > 0)
    {
      console.log("redo");
      const reSnapshot = this.snapshotRedo.pop();
      if(reSnapshot)
      {
        this.snapshotHistory.push(reSnapshot);
        this.context.putImageData(reSnapshot, 0, 0);
      }
    }  
  }
  
   //snapshot fuction
   saveSnapshot(){
    const canvasRect = this.context.canvas.getBoundingClientRect();
    const snapshotItem = this.context.getImageData(0, 0, canvasRect.width, canvasRect.height);
    this.snapshotHistory.push(snapshotItem);
  }


}
