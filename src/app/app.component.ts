import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { LiteralMapEntry } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit{
  formGroup:FormGroup;
  wrongTest1:boolean;
  wrongTest2:boolean;
  wrongTest3:boolean;
  wrongPin:boolean;
  dd = '26';
  mm = '07';
  aa = '82';

  select=[];

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(){

    this.formGroup = new FormGroup({
      'input': new FormControl(null),
      'pin': new FormControl(null),
      selected: new FormControl([null]),
    selected1: new FormControl([null]),


    })
    this.formGroup.get('pin').disable();
  }

  options = [
    {
      display: 'RM',
      value: '1'
    }, {
      display: 'MI',
      value: '2'
    }
  ];

  options1 = [
    {
      display: 'Roma',
      idOption: 1,
      value: '1'
    }, {
      display: 'Frascati',
      idOption: 1,
      value: '2'
    }, {
      display: 'Rocca di Papa',
      idOption: 1,
      value: '3'
    }, {
      display: 'Monza',
      idOption: 2,
      value: '4'
    }, {
      display: 'Lecco',
      idOption: 2,
      value: '5'
    }, {
      display: 'Como',
      idOption: 2,
      value: '6'
    }
  ];

    control(data){
      this.wrongTest1 = null;
      this.wrongTest2 = null;
      this.wrongTest3 = null;
      let dim = data.input.length;
      this.formGroup.get('pin').disable();

      if (dim===6){
        let re = /(0123|1234|2345|3456|4567|5678|6789|7890|0987|9876|8765|7654|6543|5432|4321|3210)+/ig;
        let re1 = /(0000|1111|2222|3333|4444|5555|6666|7777|8888|9999)+/ig;
        let re2 = this.dd+this.mm+this.aa;
        let re3 = this.dd+this.aa+this.mm;
        let re4 = this.mm+this.aa+this.dd;
        let re5 = this.mm+this.dd+this.aa;
        let re6 = this.aa+this.dd+this.mm;
        let re7 = this.aa+this.mm+this.dd;
        let test  = re.test(data.input);
        let test1  = re1.test(data.input);
        let test2  = data.input.includes(re2) || data.input.includes(re3) || data.input.includes(re4) || data.input.includes(re5) || data.input.includes(re6) || data.input.includes(re7);

        if (test===true){
         this.formGroup.controls['input'].setErrors({'incorrect': true});
         this.wrongTest1 = true;
         return false;
        }
        else
        {
          this.wrongTest1 = false;
        }
        if (test1===true){
          this.formGroup.controls['input'].setErrors({'incorrect': true});
          this.wrongTest2 = true;
          return false;
         }
         else
         {
           this.wrongTest2 = false;
         }
         if (test2===true){
          this.formGroup.controls['input'].setErrors({'incorrect': true});
          this.wrongTest3 = true;
          return false;
         }
         else
         {
           this.wrongTest3 = false;

         }
         this.formGroup.get('pin').enable();
      }

    }

    controlPin(data){
      this.wrongPin=null;
      let dim = data.pin.length;
     if(dim>0){

      let pin = data.input;
      pin = pin.split("");
      let pinDown = data.pin;
      pinDown = pinDown.split("");

      for(let i=0; i<pinDown.length; i++){
            if (pin[i]!==pinDown[i]){
              this.wrongPin=true;
              return false;
            }
      }
      if (dim===6)
        this.wrongPin=false;
     }

    }

    getSelectedOptions(event){

      this.select = this.options1.filter((item) => {
          return (item.idOption == this.formGroup.controls['selected'].value)
        });

      }

    onSubmit(data){
      alert('ok');
    }
}

