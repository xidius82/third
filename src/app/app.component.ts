import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit{
  formGroup:FormGroup;
  disabled:boolean;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(){
    this.disabled = true;
    this.formGroup = new FormGroup({
      'input': new FormControl(null)

    })
  }

    onSubmit(data){
      let re = /(0123|1234|2345|3456|4567|5678|6789|7890|0987|9876|8765|7654|6543|5432|4321|3210)+/ig;
      let test  = re.test(data.input);
      if (test===true){
       this.formGroup.controls['input'].setErrors({'incorrect': true});
      }
      else
      alert('ok');


    }
}

