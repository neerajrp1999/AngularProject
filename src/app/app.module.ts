import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuestionDivComponent } from './question-div/question-div.component';
import{CalculaterDematterComponent} from './calculater-dematter/calculater-dematter.component'

@NgModule({
  declarations: [
    AppComponent,
    QuestionDivComponent,
    CalculaterDematterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  
 }
