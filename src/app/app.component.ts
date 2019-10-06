import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  myModel;
  mask = [/[1-9]/, /[1-9]/, /[1-9]/, ' ', /[1-9]/, /[1-9]/, /[1-9]/, /[1-9]/, /[1-9]/, /[1-9]/, /[1-9]/, /[1-9]/, /[1-9]/, /[1-9]/];

  myControl: FormControl = new FormControl();
  options = [
    'One',
    'Two',
    'Three'
   ];


}
