import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AppService } from './service/app.service';
import { ShapeService } from './service/shape.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [AppService,ShapeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
