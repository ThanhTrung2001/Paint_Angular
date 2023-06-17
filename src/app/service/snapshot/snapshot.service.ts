import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SnapshotService {
  public context!: CanvasRenderingContext2D;
  //snapshot saving array
  public snapshotHistory: ImageData[] = [];
  public snapshotRedo: ImageData[] = [];
  //rotate saving array
  public rotateHistory: number[] = [];
  public rotateRedo: number[] = [];
  public rotateDegree:number = 0;

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
    console.log(this.snapshotHistory);
    console.log(this.snapshotRedo);
  }

  //clear snapshot if tool:select is use
  clearSnapshotHistoryOnly(){
    console.log("clear");
    if (this.snapshotHistory.length > 0) {
      const latestSnapshot = this.snapshotHistory.pop(); //remove newest snapshot and ready to load closest snapshot 
      if(latestSnapshot)
      {
        // this.snapshotRedo.push(latestSnapshot);
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



  //rotate
  saveRotateState(rotateDegree:number){
    this.rotateDegree = rotateDegree;
    this.rotateHistory.push(rotateDegree);
  }

  rollbackRotate(){
    if (this.rotateHistory.length > 0) {
      // Pop the last rotation angle from the history array
      const previousRotateDegree = this.rotateHistory.pop();
      if(previousRotateDegree)
      {
        this.rotateRedo.push(previousRotateDegree);
        this.rotateDegree = previousRotateDegree;
      }
    }
  }

  redoRotate(){
    if (this.rotateRedo.length > 0) {
      // Pop the last rotation angle from the history array
      const reRotateDegree = this.rotateRedo.pop();
      if(reRotateDegree)
      {
        this.rotateHistory.push(reRotateDegree);
        this.rotateDegree = reRotateDegree;
      }
    }
  }


}
