import { Injectable } from '@angular/core';
import { ShapeService } from '../shape/shape.service';
import { ToolService } from '../tool/tool.service';
import { SnapshotService } from '../snapshot/snapshot.service';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  //constructor for service
  constructor(
    private shapeService: ShapeService,
    private toolService: ToolService,
    private snapshotService: SnapshotService){}
  //context for canvas 
  private context!: CanvasRenderingContext2D;
  //for drawing
  private isDrawing: boolean = false;
  //stroke & line width
  public strokeColor: string = "#000";
  private lineWidth: number = 1;
  //snapshot for shape draw
  private snapshot: any;

  //set context for canvas
  setContext(context: CanvasRenderingContext2D) {
    this.context = context;
    this.snapshotService.context = this.context;
    this.shapeService.context = this.context;
  }

  //Start draw, get the current position when mouse down
  startDrawing(event: MouseEvent) {
    this.isDrawing = true;
    //config to get the right mouse position if change resolution when draw
    const canvasRect = this.context.canvas.getBoundingClientRect();
    const scaleX = this.context.canvas.width / canvasRect.width;
    const scaleY = this.context.canvas.height / canvasRect.height;
    const offsetX = (event.clientX - canvasRect.left) * scaleX;
    const offsetY = (event.clientY - canvasRect.top) * scaleY;
    this.shapeService.lastX = offsetX;
    this.shapeService.lastY = offsetY;
    this.shapeService.width = 0;
    this.shapeService.height = 0;
    //create snapshot to load every time draw shape to delete afterimage
    this.snapshot = this.context.getImageData(0,0, canvasRect.width, canvasRect.height);
  }

  //Drawing, get current mouse position eachtime and connect old point to new point
  draw(event: MouseEvent) {
    if (!this.isDrawing) return;
    const canvasRect = this.context.canvas.getBoundingClientRect();
    //get the current mouse coordinates
    const scaleX = this.context.canvas.width / canvasRect.width;
    const scaleY = this.context.canvas.height / canvasRect.height;
    const offsetX = (event.clientX - canvasRect.left) * scaleX;
    const offsetY = (event.clientY - canvasRect.top) * scaleY;
    //this is for shape
    //1.rectangle width & height
    this.shapeService.width = offsetX - this.shapeService.lastX;
    this.shapeService.height = offsetY - this.shapeService.lastY;
    //2.circle radius
    this.shapeService.radius = Math.sqrt((offsetX - this.shapeService.lastX)**2 + (offsetY - this.shapeService.lastY)**2);
    //Check if eraser
    if (this.toolService.selectedTool == 'eraser') {
      // Use globalCompositeOperation to erase instead of drawing -> delete
      this.context.globalCompositeOperation = 'destination-out';
    } else {
      this.context.strokeStyle = this.strokeColor;
      this.context.globalCompositeOperation = 'source-over';
    }
    //custom stroke, fill style
    this.context.lineJoin = 'round';
    this.context.lineCap = 'round';
    this.context.lineWidth = this.lineWidth;
    this.context.fillStyle = this.strokeColor;
    //start drawing path
    this.context.beginPath();
    //start draw line
    if(this.shapeService.shape != '')
    {
      //when draw shape -> load snapshot when start draw to make sure all afterimage will be removed
      this.context.putImageData(this.snapshot, 0 , 0); 
      this.shapeService.drawShape(offsetX, offsetY);
    }
    else if(this.toolService.selectedTool == this.toolService.isEyeDropper)
    {
      
    }
    else
    {
      this.shapeService.normalDraw(offsetX, offsetY);
      //set lastposition again (with shape -> not draw continuous -> no need to set last position like normal draw)
      this.shapeService.lastX = offsetX;
      this.shapeService.lastY = offsetY;
    }
  }

  //stop Drawing
  stopDrawing() {
    this.snapshotService.saveSnapshot();
    this.isDrawing = false;
  }

  //topDrawing when out of range of canvas
  outRange(){
    this.isDrawing = false;
  }

  //eyedrop
  eyedropPicker(event:MouseEvent){
    if(this.toolService.selectedTool != this.toolService.isEyeDropper) return;
    const canvasRect = this.context.canvas.getBoundingClientRect();
    //get the current mouse coordinates
    const scaleX = this.context.canvas.width / canvasRect.width;
    const scaleY = this.context.canvas.height / canvasRect.height;
    const offsetX = (event.clientX - canvasRect.left) * scaleX;
    const offsetY = (event.clientY - canvasRect.top) * scaleY;
    //get pixelImage data (type rgp in array) in mouse click
    const pixelData = this.context.getImageData(offsetX, offsetY, 1, 1).data;
    this.strokeColor = this.toolService.rgpToHex(pixelData);
    console.log(this.strokeColor);
  }

  //color 
  changecolor(color: string){
    this.strokeColor = color;
  }
  //stroke line width
  changeLineWidth(width: number){
    this.lineWidth = width;
  }

  //tool selected
  useTool(tool:string){
    this.toolService.useTool(tool);
    this.shapeService.shape = '';
  }

  //shape
  setShape(shape:string){
    this.shapeService.setShape(shape);
    this.toolService.selectedTool = '';
  }

  changeFill(checked: boolean)
  {
    this.shapeService.useFillShape(checked);
  }

  //clearAll
  clearAll(){
    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    this.context.fillStyle = "#fff";
    this.context.fillRect(0,0,this.context.canvas.width, this.context.canvas.height);
  }

  //save
  saveImage(){
    const link = document.createElement("a");
    link.download = `${Date.now()}.png`;
    link.href = this.context.canvas.toDataURL();
    link.click();  
  }

  //rollback
  rollback(){
    this.snapshotService.rollback();
  }

  //redo
  redo(){
    this.snapshotService.redo();  
  }

  //load
  loadImage(event:any){
    
  }
}
