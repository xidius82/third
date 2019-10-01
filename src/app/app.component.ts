import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  myModel;
  mask = [/[1-9]/, /[1-9]/, /[1-9]/, ' ', /[1-9]/, /[1-9]/, /[1-9]/, /[1-9]/, /[1-9]/, /[1-9]/, /[1-9]/, /[1-9]/, /[1-9]/, /[1-9]/];

  focusOutFunction (){
    console.log(this.myModel.replace(/\D+/g, ''));
  }
}
