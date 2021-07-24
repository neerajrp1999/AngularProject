import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-question-div',
  templateUrl: './question-div.component.html',
  styleUrls: ['./question-div.component.css']
})
export class QuestionDivComponent implements OnInit {

  @Output("answerSelected")
  public selectedAnswerEmiiter = new EventEmitter<number>();

  constructor(){
  }

  ngOnInit(): void{
  }

  radioButtonC(Qnumber:number,radioBNo:number){
    this.selectedAnswerEmiiter.emit(Qnumber);
    /**  save the ans for Quation */
  }

  updateQuestionDetails(questionId: number,RNO:number)
  {
    const myQuestion = this.arr.find(x=> x.id == questionId);
    if(RNO==0){
      return myQuestion?.q;
    }
    if(RNO==1){
      return myQuestion?.o1;
    }
    if(RNO==2){
      return myQuestion?.o2;
    }
    if(RNO==3){
      return myQuestion?.o3;
    }
    if(RNO==4){
      return myQuestion?.o4;
    }
    return;
  }
  x = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  arr = [
        {
          id: 1,
          q: "https://firebasestorage.googleapis.com/v0/b/tests-19842.appspot.com/o/q1.PNG?alt=media&token=fad97c1b-50e3-4901-b889-6e8426dafffc"
          , o1: 'https://firebasestorage.googleapis.com/v0/b/tests-19842.appspot.com/o/q1.PNG?alt=media&token=fad97c1b-50e3-4901-b889-6e8426dafffc'
          , o2: 'https://firebasestorage.googleapis.com/v0/b/tests-19842.appspot.com/o/q1.PNG?alt=media&token=fad97c1b-50e3-4901-b889-6e8426dafffc'
          , o3: 'https://firebasestorage.googleapis.com/v0/b/tests-19842.appspot.com/o/q1.PNG?alt=media&token=fad97c1b-50e3-4901-b889-6e8426dafffc'
          , o4: 'https://firebasestorage.googleapis.com/v0/b/tests-19842.appspot.com/o/q1.PNG?alt=media&token=fad97c1b-50e3-4901-b889-6e8426dafffc'
        },
        {
          id: 2,
          q: "gg"
          , o1: 'Sentence 1'
          , o2: 'Sentence 1'
          , o3: 'Sentence 1'
          , o4: 'Sentence 1'
        },
        ];

}