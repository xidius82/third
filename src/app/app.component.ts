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
  stringa:string;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(){
    this.disabled = true;
    this.stringa = "Modifica";
    this.formGroup = new FormGroup({
      'input': new FormControl('aaa'),
      'input1': new FormControl('bbbb'),
      'input2': new FormControl('cccc'),
      'input3': new FormControl('dddd'),
      'input4': new FormControl('eeee'),
      'input5': new FormControl('ffff'),
      'input6': new FormControl('gggg'),
      'input7': new FormControl('hhhh'),
      'input8': new FormControl('iiii'),
      'input9': new FormControl('lllll'),
      'input10': new FormControl('mmmm'),

    })

   
    this.control();
    
    }

    setControl(){
      if (this.disabled==true){
        this.disabled=false;
      }
      else 
      {this.disabled=true;}
      this.control();
    }

    control(){
      if (this.disabled==true){
        this.stringa = "Modifica";
        this.formGroup.controls['input'].disable();
        this.formGroup.controls['input1'].disable();
        this.formGroup.controls['input2'].disable();
        this.formGroup.controls['input3'].disable();
        this.formGroup.controls['input4'].disable();
        this.formGroup.controls['input5'].disable();
        this.formGroup.controls['input6'].disable();
        this.formGroup.controls['input7'].disable();
        this.formGroup.controls['input8'].disable();
        this.formGroup.controls['input9'].disable();
        this.formGroup.controls['input10'].disable();
      }
      else {
        this.stringa = "Annulla";
        this.formGroup.controls['input'].enable();
        this.formGroup.controls['input1'].enable();
        this.formGroup.controls['input2'].enable();
        this.formGroup.controls['input3'].enable();
        this.formGroup.controls['input4'].enable();
        this.formGroup.controls['input5'].enable();
        this.formGroup.controls['input6'].enable();
        this.formGroup.controls['input7'].enable();
        this.formGroup.controls['input8'].enable();
        this.formGroup.controls['input9'].enable();
        this.formGroup.controls['input10'].enable();
      }

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

