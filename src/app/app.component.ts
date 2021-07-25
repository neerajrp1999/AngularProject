import { variable } from '@angular/compiler/src/output/output_ast';
import { Component, NgModule } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private router: Router) { }

  username: any;
  password: any;
  
    ngOnInit() {
    }

    sing_in1() {
      if(this.username == 'admin' && this.password == 'admin'){
       this.router.navigate(["user"]);
      }else {
        alert("Invalid credentials");
      }
    }
    sing_up1(){
      document.getElementById("mainContain1")?.setAttribute("style", "display: none;");
      document.getElementById("mainContain2")?.setAttribute("style", "display: block;"); 
    }
    sing_in2() {
      document.getElementById("mainContain2")?.setAttribute("style", "display: none;");
      document.getElementById("mainContain1")?.setAttribute("style", "display: block;"); 
    }
    sing_up2(){
    }
    UserNameOnFocusOutEvent1(ev:any){
      ev.target.value="focus out";
    }
    PasswordOnFocusOutEvent1(ev:any){
      ev.target.value="focus out";
    }
    NameOnFocusOutEvent2(ev:any){
      ev.target.value="focus out";
    }
    UserNameOnFocusOutEvent2(ev:any){
      ev.target.value="focus out";
    }
    EmailIdOnFocusOutEvent2(ev:any){
      ev.target.value="focus out";
    }
    PasswordOnFocusOutEvent2(ev:any){
      ev.target.value="focus out";
    }
    RePasswordOnFocusOutEvent2(ev:any){
      ev.target.value="focus out";
    }
    MobileKeyUp(ev:any){
      ev.target.value=ev.target.value.replace(/[^0-9]/g,'');
    }
}