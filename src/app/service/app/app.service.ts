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
  public context!: CanvasRenderingContext2D;
  //for drawing
  public isDrawing: boolean = false;
  private offsetX: number = 0;
  private offsetY: number = 0;
  //stroke & line width
  public strokeColor: string = "#000";
  public lineWidth: number = 1;
  //snapshot for shape draw
  private snapshot: any;
  //zoom
  private zoomScale: number = 1;

  //set context for canvas
  setContext(context: CanvasRenderingContext2D) {
    this.context = context;
    this.snapshotService.context = this.context;
    this.shapeService.context = this.context;
  }

  getContext(){
    return this.context;
  }

  changeDrawState(drawing: boolean){
    this.isDrawing = drawing;
  }

  //Start draw, get the current position when mouse down
  startDrawing(event: MouseEvent) {
    this.changeDrawState(true)
    //config to get the right mouse position if change resolution when draw
    const canvasRect = this.context.canvas.getBoundingClientRect();
    const scaleX = this.context.canvas.width / canvasRect.width;
    const scaleY = this.context.canvas.height / canvasRect.height;
    this.offsetX = (event.clientX - canvasRect.left) * scaleX;
    this.offsetY = (event.clientY - canvasRect.top) * scaleY;
    this.shapeService.lastX = this.offsetX;
    this.shapeService.lastY = this.offsetY;
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
    this.offsetX = (event.clientX - canvasRect.left) * scaleX;
    this.offsetY = (event.clientY - canvasRect.top) * scaleY;
    //this is for shape
    //1.rectangle width & height
    this.shapeService.width = this.offsetX - this.shapeService.lastX;
    this.shapeService.height = this.offsetY - this.shapeService.lastY;
    //2.circle radius
    this.shapeService.radius = Math.sqrt((this.offsetX - this.shapeService.lastX)**2 + (this.offsetY - this.shapeService.lastY)**2);
    //Check if eraser
    if (this.toolService.selectedTool == 'eraser') {
      // Use globalCompositeOperation to erase instead of drawing -> delete
      this.context.globalCompositeOperation = 'destination-out';
    } else {
      this.context.strokeStyle = this.strokeColor;
      this.context.globalCompositeOperation = 'source-over';
    }
    //custom stroke, fill style
    this.context.lineJoin = 'miter';
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
      this.shapeService.drawShape(this.offsetX, this.offsetY);
    }
    else if(this.toolService.selectedTool == this.toolService.isEyeDropper)
    {
      
    }
    else if(this.toolService.selectedTool == this.toolService.isInk)
    {
      
    }
    else
    {
      if (this.toolService.selectedTool == this.toolService.isText)
      {

      }
      else {
        this.shapeService.normalDraw(this.offsetX, this.offsetY);
        //set lastposition again (with shape -> not draw continuous -> no need to set last position like normal draw)
        this.shapeService.lastX = this.offsetX;
        this.shapeService.lastY = this.offsetY;
      }
    }
  }

  //stop Drawing
  stopDrawing() {
    this.snapshotService.saveSnapshot();
    if(this.shapeService.shape != '')
    {
      this.shapeService.saveShapeArea(this.offsetX, this.offsetY);
    }
    this.changeDrawState(false);
  }

  //topDrawing when out of range of canvas
  outRange(){
    this.isDrawing = false;
  }

  //ink
  areaInk(event: MouseEvent){
    let insideShape:boolean = false;
    const canvasRect = this.context.canvas.getBoundingClientRect();
    //get the current mouse coordinates
    const scaleX = this.context.canvas.width / canvasRect.width;
    const scaleY = this.context.canvas.height / canvasRect.height;
    const offsetX = (event.clientX - canvasRect.left) * scaleX;
    const offsetY = (event.clientY - canvasRect.top) * scaleY;
    //check color for pixel selected
    const pixelData = this.context.getImageData(offsetX, offsetY, 1, 1).data;
    const pixelColor = this.toolService.rgpToHex(pixelData);
    //check the point is inside shape
    const shape = this.shapeService.shapes.find(area => {
      return this.context.isPointInPath(area.shapeItem, offsetX, offsetY);
    });
    if (shape != null) {
      insideShape = true;
    }
    for(let x = -1; x < canvasRect.width; x ++)
    {
      for(let y = -1; y < canvasRect.height; y ++)
      {
        if(insideShape == true)
        {
          if(this.context.isPointInPath(shape!.shapeItem, x, y) == true)
          {
            const pixelDataChild = this.context.getImageData(x, y, 1, 1).data;
            const pixelColorChild = this.toolService.rgpToHex(pixelDataChild);
            this.context.fillStyle = this.strokeColor;
            if(pixelColorChild == pixelColor)
            {
              this.context.fillRect(x, y, 1,1);
            }
          }
        }
        else
        {
          let pointOutside:boolean = true;
          this.shapeService.shapes.forEach(area => {
            if(this.context.isPointInPath(area!.shapeItem, x, y) == true)
            {
              pointOutside = false;
            }
          });
          if(pointOutside == true)
          {
            this.context.fillStyle = this.strokeColor;
            this.context.fillRect(x, y, 1,1);
          }
        }
      }
    }
    //save snapshot
    this.snapshotService.saveSnapshot();
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

  //zoom
  changeZoomScale(event: any){
    
  }

  //tool selected
  useTool(tool:string){
    this.toolService.useTool(tool);
    this.shapeService.shape = '';
  }

  getTool() : string{
    return this.toolService.selectedTool;
  }

  //shape
  setShape(shape:string){
    this.shapeService.setShape(shape);
    this.toolService.selectedTool = '';
  }

  getShape() : string{
    return this.shapeService.shape;
  }

  //change fill shape
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
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const image = new Image();
        image.onload = () => {
          this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
          this.context.drawImage(image, 0, 0);
        };
        image.src = e.target.result;
      };

      reader.readAsDataURL(file);
    }
  }
}
