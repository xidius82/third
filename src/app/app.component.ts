import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent  implements OnInit{
  formGroup:FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(){
    this.formGroup = new FormGroup({
      'email': new FormControl(null)})
    
    
    }

    onSubmit(data){
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      let test  = re.test(data.email);
      if (test==false){
       this.formGroup.controls['email'].setErrors({'incorrect': true});
      }
      else
      alert('ok');

  
    }
}

