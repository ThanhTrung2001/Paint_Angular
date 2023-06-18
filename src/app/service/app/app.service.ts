import { Injectable } from '@angular/core';
import { ShapeService } from '../shape/shape.service';
import { ToolService } from '../tool/tool.service';
import { SnapshotService } from '../snapshot/snapshot.service';
import { SelectedRect } from 'src/app/model/selectedRect';

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
  public offsetX: number = 0;
  public offsetY: number = 0;
  //stroke & line width
  public strokeColor: string = "#000";
  public fillColor:string = "#fff";
  public lineWidth: number = 1;
  //snapshot for shape draw
  private snapshot: any;
  //rotate or flip
  private rotateDegree:number = 0;
  private isFlipHorizontal:boolean = false;
  private isFlipVertical:boolean = false;
  private tempOldCanvas:any;
  private tempOldContext:any;
  private tempCanvas:any;
  private tempContext:any;
  //text
  private text:string = '';
  private isTexting:boolean = false;

  //set context for canvas
  setContext(context: CanvasRenderingContext2D) {
    this.context = context;
    this.snapshotService.context = this.context;
    this.shapeService.context = this.context;
    //
    this.tempCanvas = document.createElement('canvas');
    this.tempContext = this.tempCanvas.getContext('2d');
    this.tempOldCanvas = document.createElement('canvas');
    this.tempOldContext = this.tempCanvas.getContext('2d');
    this.tempCanvas.width = this.context.canvas.width;
    this.tempCanvas.height = this.context.canvas.height;
    this.tempOldCanvas.width = this.context.canvas.width;
    this.tempOldCanvas.height = this.context.canvas.height;
  }

  getContext(){
    return this.context;
  }

  changeDrawState(drawing: boolean){
    this.isDrawing = drawing;
  }

  //Start draw, get the current position when mouse down
  startDrawing(event: MouseEvent) {
    if(this.toolService.selectedTool == this.toolService.isText)
    {
      this.isTexting == true;
      if(this.text != '')
      {
        this.snapshotService.saveSnapshot();
        this.text = '';
      }
    }
    else{
      if(this.isTexting == true)
      {
        this.isTexting = false;
        this.snapshotService.saveSnapshot();
        this.text = '';
      }
    }
    this.changeDrawState(true)
    if(this.shapeService.existSelected == true)
    {
      this.snapshotService.clearSnapshotHistoryOnly();
      this.shapeService.existSelected = false;
    }
    //config to get the right mouse position if change resolution when draw
    const canvasRect = this.context.canvas.getBoundingClientRect();
    const scaleX = this.context.canvas.width / canvasRect.width;
    const scaleY = this.context.canvas.height / canvasRect.height;
    this.offsetX = (event.clientX - canvasRect.left) * scaleX;
    this.offsetY = (event.clientY - canvasRect.top) * scaleY;
    this.shapeService.lastX =this.isFlipHorizontal? this.context.canvas.width - this.offsetX : this.offsetX;
    this.shapeService.lastY =this.isFlipVertical? this.context.canvas.height -this.offsetY : this.offsetY;
    this.shapeService.width = 0;
    this.shapeService.height = 0;
    //create snapshot to load every time draw shape to delete afterimage
    this.snapshot = this.context.getImageData(0,0, canvasRect.width, canvasRect.height);
  }

  //Drawing, get current mouse position eachtime and connect old point to new point
  draw(event: MouseEvent, handle:string) {
    //get mouse position when move for drawing = true and false
    const canvasRect = this.context.canvas.getBoundingClientRect();
    //get the current mouse coordinates
    const scaleX = this.context.canvas.width / canvasRect.width;
    const scaleY = this.context.canvas.height / canvasRect.height;
    this.offsetX = this.isFlipHorizontal? this.context.canvas.width - ((event.clientX - canvasRect.left) * scaleX) : (event.clientX - canvasRect.left);
    this.offsetY = this.isFlipVertical? this.context.canvas.height - ((event.clientY - canvasRect.top) * scaleY) : (event.clientY - canvasRect.top);
    if (!this.isDrawing) {
      return;
    }
    //this is for shape
    //1.rectangle width & height
    this.shapeService.width = this.offsetX - this.shapeService.lastX;
    this.shapeService.height = this.offsetY - this.shapeService.lastY;
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
    this.context.strokeStyle = this.strokeColor;
    this.context.fillStyle = this.fillColor;
    //start drawing path
    this.context.beginPath();
    //start draw line
    if(this.shapeService.shape != '')
    {
      //when draw shape -> load snapshot when start draw to make sure all afterimage will be removed
      this.context.putImageData(this.snapshot, 0 , 0); 
      this.shapeService.drawShape(this.offsetX, this.offsetY, this.strokeColor, this.fillColor);
    }
    else if(this.toolService.selectedTool == this.toolService.isSelectArea)
    {
      this.context.putImageData(this.snapshot, 0 , 0); 
      this.shapeService.selectArea();
      this.shapeService.existSelected = true;
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
        console.log()
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
    // this.tempContext.drawImage(this.context.canvas, 0, 0);
    if(this.toolService.selectedTool == this.toolService.isText)
    {
      return;
    }
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
            this.context.fillStyle = this.fillColor;
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
  //fillcolor 
  changeFillcolor(color: string){
    this.fillColor = color;
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
          if(image.width <= this.context.canvas.width && image.height <= this.context.canvas.height){
            this.context.drawImage(image, 0, 0);
          }
          else{
            ////1. Build The image follow resolution
            // //get the ratio of image for canvas
            // const imageRatio = image.width / image.height;
            // const canvasRatio = this.context.canvas.width / this.context.canvas.height;
            // // defind the new size for image in canvas
            // let drawWidth:number = 0;
            // let drawHeight:number = 0;
  
            // if (imageRatio > canvasRatio) {
            //   drawWidth = this.context.canvas.width;
            //   drawHeight = this.context.canvas.width / imageRatio;
            // } else {
            //   drawWidth = this.context.canvas.height * imageRatio;
            //   drawHeight = this.context.canvas.height;
            // }

            // this.context.drawImage(image, 0, 0, image.width, image.height, 0, 0, drawWidth, drawHeight);
            
            //2.build the image full canvas
            this.context.canvas.width = image.width;
            this.context.canvas.height = image.height;
            this.context.drawImage(image, 0, 0, image.width, image.height, 0, 0, image.width, image.height);
          }
          
        };
        image.src = e.target.result;
      };

      reader.readAsDataURL(file);
    }
  }

  //rotate function
  rotate(rotateDegree: number){
    if(this.rotateDegree == 0 )
    {
      this.tempOldContext.drawImage(this.context.canvas,0,0);
    }
    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    this.rotateDegree += rotateDegree;
    console.log(this.rotateDegree);
    
    if(this.rotateDegree == 360 || this.rotateDegree == -360) {
      this.rotateDegree = 0;
    }
    const radians = this.rotateDegree * (Math.PI / 180);
    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    this.context.save();
    this.context.translate(this.context.canvas.width/2, this.context.canvas.height/2);
    this.context.rotate(radians);
    this.context.drawImage(this.tempOldContext.canvas, -this.context.canvas.width / 2, -this.context.canvas.height / 2);
    this.context.restore();
 
  }

  //flip
  flipHorizontal(){
    this.tempContext.drawImage(this.context.canvas, 0, 0);
    // this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    if(this.isFlipHorizontal == false)
    {
      this.isFlipHorizontal = true;
    }
    else{
      this.isFlipHorizontal = false;
    }
    this.context.translate(this.context.canvas.width, 0);
    this.context.scale(-1, 1);
    this.context.drawImage(this.tempContext.canvas, 0, 0);
    this.snapshotService.saveSnapshot();
  }

  flipVertical(){
    this.tempContext.drawImage(this.context.canvas, 0, 0);
    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    if(this.isFlipVertical == false)
    {
      this.isFlipVertical = true;
    }
    else{
      this.isFlipVertical = false;
    }
    this.context.translate(0, this.context.canvas.height);
    this.context.scale(1, -1);
    this.context.drawImage(this.tempContext.canvas, 0, 0);
    this.snapshotService.saveSnapshot();
  }

  //area
  copySelected(){
    if(!this.isDrawing && this.shapeService.snapshotSelected != null && this.shapeService.existSelected == true)
    {
      if(this.shapeService.isDeleteSnapshot == false)
      {
        this.shapeService.snapshotCopy = this.shapeService.snapshotSelected;
        this.snapshotService.clearSnapshotHistoryOnly();
        this.shapeService.existSelected= false;
      }
      
    }
  }

  cutSelected(){
    if(!this.isDrawing && this.shapeService.snapshotSelected != null && this.shapeService.existSelected == true)
    {
      this.shapeService.snapshotCopy = this.shapeService.snapshotSelected;
      this.snapshotService.rollback();
      this.shapeService.cutSelectArea();
      this.shapeService.existSelected= false;
    }
  }

  pasteSelected(){
    if(!this.isDrawing && this.shapeService.snapshotCopy != null)
    {
      this.context.beginPath();
      this.context.putImageData(this.shapeService.snapshotCopy, this.offsetX - this.shapeService.selectedRect.w/2, this.offsetY - this.shapeService.selectedRect.h/2);
      this.snapshotService.saveSnapshot();
    }
  }

  deleteSelected(){
    if(!this.isDrawing && this.shapeService.snapshotSelected != null)
    {
      this.shapeService.snapshotCopy = null;
      this.snapshotService.clearSnapshotHistoryOnly();
      this.shapeService.cutSelectArea();
      this.snapshotService.saveSnapshot();
      this.shapeService.isDeleteSnapshot = true;
    }
  }

  //draw Text
  drawText(event:KeyboardEvent){
    if(this.toolService.selectedTool == this.toolService.isText)
    {
      this.context.putImageData(this.snapshot, 0 , 0);
      if(event.key == 'Backspace')
      {
        this.text = this.text.substring(0, this.text.length-1);
      }
      else
      {
        this.text += event.key;
      }
      //custom stroke, fill style
      this.context.lineJoin = 'miter';
      this.context.lineCap = 'round';
      this.context.lineWidth = this.lineWidth;
      this.context.fillStyle = this.strokeColor;
      this.context.font = "30px Arial";
      //start drawing path
      this.context.fillText(this.text, this.shapeService.lastX, this.shapeService.lastY);
    }
  }
}
