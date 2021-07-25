import { CalculaterDematterComponent } from '../calculater-dematter/calculater-dematter.component';
import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-test-series',
  templateUrl: './test-series.component.html',
  styleUrls: ['./test-series.component.css']
})
export class TestSeriesComponent {

  
  constructor(private modalService: NgbModal) { }

  title = 'dataTest';
  x = [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10], [11, 12, 13, 14, 15], [16, 17, 18, 19, 20]];
  variable = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  GstatusColor(y: number) {
    if (this.variable[y - 1]) {
      return 'green';
    }
    return 'white';
  }

  attemptedQuestion(questionNumber: number) {
    this.variable[questionNumber - 1] = 1;
  }

  openCalculator() {
    this.modalService.open(CalculaterDematterComponent);
  }

}

