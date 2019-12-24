import { Component, OnInit } from '@angular/core';
import { PersonToRegister } from '../interfaces/registration-interface';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { InternalService } from '../services/internal-service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { SummaryService } from '../services/summary';
import { MatDialog } from '@angular/material';
import * as CodiceFiscaleUtils from '@marketto/codice-fiscale-utils';
import { TransitiveCompileNgModuleMetadata } from '@angular/compiler';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {

noCoerenzaFiscaleCode = false;
selectProv = false;
counterForErrorPV: number = 0;
counterForErrorCM: number = 0;
hiddenConfermaProsegui: boolean = true;
hiddenAnnulla: boolean = false;
hiddenProvinciaComune: boolean = true;
disabledInModifica: boolean;
recoveryValue: boolean=false;
cf: string;
name: string;
surname: string;
personInCache: PersonToRegister;
formdata: FormGroup;
catchChangeAfterDisabledForm: boolean = false;
initialDate: any;
listaProvince: any;
listaNazioni: any;
visible: boolean;
fromErrorCodiceFiscale: boolean = false;
firstLoading: boolean = true;
tempBirthday: any;
tempSex: any;

codeFiscalDecoded: any = {
  decoded: '',
  places: '',
  catastalCode: ''
};

comuneChosen = {
  code: '',
  catastalCode: '',
  description: ''
};

provinceChosen = {
  code: '',
  catastalCode: '',
  description: ''
};

nationChosen = {
  code: '',
  catastalCode: '',
  description: ''
};

tempCommuneChosen = {
  code: '',
  catastalCode: '',
  description: ''
};

tempProvinceChosen = {
  code: '',
  catastalCode: '',
  description: ''
};

tempNationChosen = {
  code: '',
  catastalCode: '',
  description: ''
};

chosenSex: any;
selectedValue: string;

regexCodiceFiscale = new RegExp(regex.codeFiscalPartA + regex.codeFiscalPartB, 'i' );
fromBackNoCalculateFiscalCode: boolean = false;
nationality = 'ITALIA';

  constructor(private service: InternalService, fb: FormBuilder, public datepipe: DatePipe, private router: Router,
    private summaryService: SummaryService, private dialog: MatDialog
    ) {

      this.formdata = fb.group({
        name: new FormControl('',[Validators.required, Validators.pattern(regex.numberAllCharacterWithAccent)]),
        surname: new FormControl('',[Validators.required, Validators.pattern(regex.numberAllCharacterWithAccent)]),
        fiscalcode: new FormControl('',[Validators.required]),
        birthdate: new FormControl('',[Validators.required]),
        nation: new FormControl('',[Validators.required]),
        province: new FormControl('',[]),
        comune: new FormControl('',[]),
        sex: new FormControl('',[Validators.required]),
      })

    }

  ngOnInit() {

    const {Parser} = CodiceFiscaleUtils;
    this.personInCache = this.service.loadDataRegistrationForm();
    if (this.personInCache && this.personInCache.nation){
      this.codeFiscalDecoded.decoded = Parser.cfDecode(this.cf);
      this.codeFiscalDecoded.places = Parser.cfToBirthPlace(this.cf);
      this.codeFiscalDecoded.catastalCode = this.getCatastalCodeFromFiscalCode(this.cf);
      this.fromBackNoCalculateFiscalCode = true;
      this.nationChosen = this.personInCache.nation;
      this.formdata.controls['nation'].setValue(this.nationChosen.description);
      this.provinceChosen = this.personInCache.province;
      this.formdata.controls['nation'].value===this.nationality?this.hiddenProvinciaComune=false:this.hiddenProvinciaComune=true;
      this.formdata.controls['province'].setValue(this.provinceChosen.description);
      this.comuneChosen = this.personInCache.commune;
      this.formdata.controls['commune'].setValue(this.comuneChosen.description);
      this.formdata.controls['birthdate'].setValue(this.personInCache.birthday);
      this.formdata.controls['sex'].setValue(this.personInCache.sex);
    }

    this.getNat();
    this.getProv();

    this.formdata.valueChanges.subscribe(value => {

      this.noCoerenzaFiscaleCode = false;
      if(!this.recoveryValue){
        if(this.cf !== value.fiscalcode){
          if(!this.codiceFiscaleFormalControl(value.fiscalcode)){
            this.cf = value.fiscalcode;
            this.decode(this.cf);
          }
        }
        !this.catchChangeAfterDisabledForm?this.hiddenConfermaProsegui=false:this.catchChangeAfterDisabledForm=!this.catchChangeAfterDisabledForm;
      }
      if(event){
        event.stopImmediatePropagation();
      }
    });

  }

  codiceFiscaleFormalControl(codiceFiscale): any {
    if(!this.regexCodiceFiscale.test(codiceFiscale)){
      this.formdata.controls['fiscalcode'].setErrors(
        {'incorrect': true });
    }
    return !this.regexCodiceFiscale.test(codiceFiscale);
  }

  setFormDisable(param){
    this.disabledInModifica = !param;
    this.hiddenConfermaProsegui = true;

    if (param){
      this.formdata.disable();
      this.recoveryValue = true;
      this.formdata.controls['fiscalcode'].setValue(this.cf);
      this.formdata.controls['name'].setValue(this.personInCache.name);
      this.formdata.controls['surname'].setValue(this.personInCache.surname);
      this.formdata.controls['birthdate'].setValue(this.tempBirthday);
      this.formdata.controls['sex'].setValue(this.tempSex);

      if(this.tempNationChosen && this.tempNationChosen.description){
        this.formdata.controls['nation'].setValue(this.tempNationChosen.description.toUpperCase());
      }

      if(this.formdata.controls['nation'].value === this.nationality){
        this.hiddenProvinciaComune = false;
      }
      else {
        this.hiddenProvinciaComune = true;
      }

      if(this.tempProvinceChosen && this.tempProvinceChosen.description){
        this.formdata.controls['province'].setValue(this.tempProvinceChosen.description.toUpperCase());
      }

      if(this.tempCommuneChosen && this.tempCommuneChosen.description){
        this.formdata.controls['commune'].setValue(this.tempCommuneChosen.description.toUpperCase());
      }

    }
    else {
      this.recoveryValue = false;
      this.tempSex = this.formdata.controls['sex'].value;
      this.tempBirthday = this.formdata.controls['birthdate'].value;
      this.tempNationChosen = this.nationChosen;
      this.tempProvinceChosen = this.provinceChosen;
      this.tempCommuneChosen = this.comuneChosen;
      this.catchChangeAfterDisabledForm = true;
      this.formdata.enable();
    }
  }

}
