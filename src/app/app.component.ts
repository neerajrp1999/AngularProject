import { variable } from '@angular/compiler/src/output/output_ast';
import { Component,AfterViewInit,ElementRef, NgModuleRef} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(acttiveModel: NgModuleRef)

  title = 'dataTest';
  x = [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10], [11, 12, 13, 14, 15], [16, 17, 18, 19, 20]];
  variable=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

  GstatusColor(y:number){
    if (this.variable[y-1]){
      return 'green';
    }
    return 'white';
  }

  attemptedQuestion(questionNumber: number){
    this.variable[questionNumber-1] = 1;
  }

  openCalculator(){

  }

}

