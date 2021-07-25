import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuestionDivComponent } from './question-div/question-div.component';
import{CalculaterDematterComponent} from './calculater-dematter/calculater-dematter.component'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TestSeriesComponent } from './test-series/test-series.component';


@NgModule({
  declarations: [
    AppComponent,
    QuestionDivComponent,
    CalculaterDematterComponent,
    TestSeriesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  
 }
