import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AppService } from './service/app/app.service';
import { ShapeService } from './service/shape/shape.service';
import { ToolService } from './service/tool/tool.service';
import { SnapshotService } from './service/snapshot/snapshot.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [AppService,ShapeService, ToolService, SnapshotService],
  bootstrap: [AppComponent]
})
export class AppModule { }
