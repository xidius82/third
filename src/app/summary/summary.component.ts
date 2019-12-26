import { Component, OnInit, HostListener } from '@angular/core';
import { PersonToRegister } from '../interfaces/registration-interface';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { InternalService } from '../services/internal-service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { SummaryService } from '../services/summary';
import * as CodiceFiscaleUtils from '@marketto/codice-fiscale-utils';
import { regex } from '../constant/regex';
import {MatDialogConfig, MatDialog} from '@angular/material';
import { AutocompleteComponent } from '../autocomplete/autocomplete.component';
import { PopupErrorComponent } from '../popup-error/popup-error.component';

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

regexCodiceFiscale = new RegExp(regex.codFiscalePartA + regex.codFiscalePartB, 'i' );
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

    getNat(){

      this.summaryService.getNazioni()
      .subscribe(res => {
        const esito = res['esito'];
        if(esito === 'OK'){
          this.listaNazioni = res['lista'];
        }
      })
      
    }

    getProv(){
      this.summaryService.getProvince()
      .subscribe(res => {
        const esito = res['esito'];
        if(esito === 'OK'){
          this.listaProvince = res['lista'];
          if(!this.codiceFiscaleFormalControl(this.cf) && !this.fromBackNoCalculateFiscalCode){
            this.decode(this.cf);
          }
          this.fromBackNoCalculateFiscalCode= false;
        }
        else {
          this.openDialogPV();
        }
      })
    }

    getCom(pv){
      this.summaryService.getComuni(pv)
      .subscribe(res => {
        const esito = res['esito'];
        if(esito === 'OK'){
         res['lista'].forEach(comune => {
           if (comune.catastalCode === this.codeFiscalDecoded.catastalCode){
             this.comuneChosen = comune;
             this.formdata.controls['commune'].setValue(this.comuneChosen.description.toUpperCase());
           }
         })
        }
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

  decode(cf){
    const {Parser} = CodiceFiscaleUtils;
    this.codeFiscalDecoded.decoded = Parser.cfDecode(cf);
    this.codeFiscalDecoded.places = Parser.cfToBirthPlace(cf);
    this.codeFiscalDecoded.catastalCode = this.getCatastalCodeFromFiscalCode(cf);
    let zero = 0;
    let dieci = 10;

    if (this.codeFiscalDecoded.decoded){
      if(this.codeFiscalDecoded.decoded.gender){
        this.formdata.controls['sex'].setValue(this.codeFiscalDecoded.decoded.gender);

      }
      else {
        this.formdata.controls['sex'].markAsTouched();
        this.formdata.controls['sex'].setErrors({'required': true});
        this.fromErrorCodiceFiscale = true;
        this.setFormDisable(false);
      }

      if(this.codeFiscalDecoded.decoded.date){
        this.formdata.controls['birthdate'].setValue(this.codeFiscalDecoded.decoded.date.toISOString().substring(zero,dieci));
        this.initialDate = this.codeFiscalDecoded.decoded.date.toISOString().substring(zero,dieci);

      }
      else {
        this.formdata.controls['birthdate'].markAsTouched();
        this.formdata.controls['birthdate'].setErrors({'required': true});
        this.fromErrorCodiceFiscale = true;
        this.setFormDisable(false);
      }

      if(this.codeFiscalDecoded.catastalCode){
          if(this.codeFiscalDecoded.catastalCode.toUpperCase().includes("Z")){
              if(this.listaNazioni){
                this.listaNazioni.forEach(nat => {
                  if(nat.code.toUpperCase() === this.codeFiscalDecoded.catastalCode.toUpperCase()){

                      this.nationChosen = nat;
                      this.formdata.controls['nation'].setValue(this.nationChosen.description.toUpperCase());

                  }
                });
              }
              else {
                this.hiddenProvinciaComune = true;
                this.formdata.controls['nation'].markAsTouched();
                this.formdata.controls['nation'].setErrors({'required': true});
                this.fromErrorCodiceFiscale = true;
                this.setFormDisable(false);
              }
              this.formdata.controls['province'].setValue('');
              this.formdata.controls['commune'].setValue('');
              this.hiddenProvinciaComune = true;
            } else {
              this.hiddenProvinciaComune = false;
              if(this.listaNazioni){
                this.listaNazioni.forEach(nat => {
                  if(nat.description.toUpperCase() === this.nationality){

                      this.nationChosen = nat;
                      this.formdata.controls['nation'].setValue(this.nationChosen.description.toUpperCase());

                  }
                });
              }
              else {
                this.hiddenProvinciaComune = true;
                this.formdata.controls['nation'].markAsTouched();
                this.formdata.controls['nation'].setErrors({'required': true});
                this.fromErrorCodiceFiscale = true;
                this.setFormDisable(false);
              }
              if (this.codeFiscalDecoded.places && this.codeFiscalDecoded.places.province){
                this.listaProvince.forEach(prov => {
                  if(prov.code=== this.codeFiscalDecoded.places.province){

                      this.provinceChosen = prov;
                      this.getCom(this.provinceChosen.code);

                  }
                });
                this.formdata.controls['province'].setValue(this.provinceChosen.description.toUpperCase());
              }
              else {
              
                this.formdata.controls['commune'].markAsTouched();
                this.formdata.controls['province'].markAsTouched();
                this.formdata.controls['province'].setErrors({'incorrect': true});
                this.formdata.controls['commune'].setErrors({'incorrect': true});
                this.fromErrorCodiceFiscale = true;
                this.setFormDisable(false);
              }

          }
      }
      else {
        this.hiddenProvinciaComune = true;
        this.formdata.controls['nation'].markAsTouched();
        this.formdata.controls['nation'].setErrors({'incorrect': true});
        this.fromErrorCodiceFiscale = true;
        this.setFormDisable(false);
      }

    }
    else {
      this.fromErrorCodiceFiscale = true;
      this.formdata.controls['sex'].markAsTouched();
      this.formdata.controls['nation'].markAsTouched();
      this.formdata.controls['birthdate'].markAsTouched();
      this.formdata.controls['sex'].setErrors({required: true});
      this.formdata.controls['nation'].setErrors({required: true});
      this.formdata.controls['birthdate'].setErrors({required: true});
      this.setFormDisable(false);
    }
    this.gestioneFristLoading();
  }

  gestioneFristLoading(){

    if(this.firstLoading && this.fromErrorCodiceFiscale){
      this.hiddenAnnulla = true;
    }
    this.firstLoading = false;

  }

  onFormSubmit(){
    if(this.formdata.valid){
      if(this.setCheckDataFiscalCode()){
        this.personInCache.codiceFiscale = this.formdata.controls['fiscalcode'].value;
        this.personInCache.name = this.formdata.controls['name'].value;
        this.personInCache.surname = this.formdata.controls['surname'].value;
        this.personInCache.nation = this.formdata.controls['nation'].value;
        this.personInCache.province = this.formdata.controls['province'].value;
        this.personInCache.commune = this.formdata.controls['commune'].value;
        this.personInCache.birthday = this.formdata.controls['birthdate'].value;
        this.personInCache.sex = this.formdata.controls['sex'].value;
        this.service.saveDataRegistrationForm(this.personInCache);
        alert('CIAOOO');
      }
      else {
        this.noCoerenzaFiscaleCode = true;
      }
    }
  }

  setCheckDataFiscalCode(){
    if(!this.checkNameSurname()) {return false;}
    if(!this.checkBirthday()){ return false;}
    if(!this.checkCommuneNation()){ return false;}
    return true;
  }

  checkNameSurname(){
    let surname = this.codeFiscalDecoded.decoded.surname.toUpperCase().replace(/[*]/g, '').split('');
    let name = this.codeFiscalDecoded.decoded.name.toUpperCase().replace(/[*]/g, '').split('');
    let tempName = this.formdata.controls['name'].value.toUpperCase();
    let tempSurName = this.formdata.controls['surname'].value.toUpperCase();

    for(let i=0;i< name.length;i++){
      if(tempSurName.indexOf(surname[i]) >= 0){
        tempSurName = tempSurName.substring((tempSurName.indexOf(surname[i])+1), tempSurName.length);
      }else {
        return false;
      }
      if(tempName.indexOf(name[i]) >= 0){
        tempName = tempName.substring((tempName.indexOf(name[i])+1), tempName.length);
      }else {
        return false;
      }
    }
    return true;
  }

  getCatastalCodeFromFiscalCode(fiscalCode: string): string {

    let firstPositionCodCatasale = 11;
    let secondPositionCodCatasale = 15;
    return fiscalCode.substring(firstPositionCodCatasale,secondPositionCodCatasale);

  }

  checkBirthday(){
    let dayPosition = 2;
    let parts = this.formdata.controls['birthdate'].value.split('-');
    let birthdate = new Date(parts[0], parts[1]-1, parts[dayPosition]);
    let tempBirthdate = new Date(this.codeFiscalDecoded.decoded.year, this.codeFiscalDecoded.decoded.month,this.codeFiscalDecoded.decoded.day);
    
    if(birthdate.toDateString() !== tempBirthdate.toDateString()){
      return false;
    }
    return true;
  }

  checkCommuneNation(){
    let catastalCode = this.getCatastalCodeFromFiscalCode(this.formdata.controls['fiscalcode'].value);
    if (this.comuneChosen.catastalCode.toUpperCase() === catastalCode.toLocaleUpperCase() || this.nationChosen.code.toUpperCase() === catastalCode.toUpperCase()){
      return true;
    }
    return false;
  }

  openDialogNazione(){
    if(this.disabledInModifica){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.id = "nazione";
      dialogConfig.height = "100%";
      dialogConfig.width = '100%';
      dialogConfig.data = { 'name': 'listNazione', 'lista': this.listaNazioni};
      this.dialog.open(AutocompleteComponent,dialogConfig).afterClosed().subscribe(response => {
        if(response){
          this.nationChosen = response["data"];
          this.formdata.controls['nation'].setValue(this.nationChosen.description.toUpperCase());
          if(this.formdata.controls['nation'].value === this.nationality){
            this.hiddenProvinciaComune = false;
            this.openDialogProvincia();
          }else {
            this.formdata.controls['province'].setValue('');
            this.formdata.controls['commune'].setValue('');
            this.hiddenProvinciaComune = true;
          }
        }
      })
    }
  }

  openDialogProvincia(){
    if(this.nationChosen && this.nationChosen.description !=='' && this.disabledInModifica){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.id = "provincia";
      dialogConfig.height = "100%";
      dialogConfig.width = '100%';
      dialogConfig.data = { 'name': 'listProvincia', 'lista': this.listaProvince};
      this.dialog.open(AutocompleteComponent,dialogConfig).afterClosed().subscribe(response => {
        if(response){
          this.provinceChosen = response["data"];
          this.formdata.controls['province'].setValue(this.provinceChosen.description.toUpperCase());
            this.openDialogComune();
         
        }
      })
    }
  }

  openDialogPV(): void{
   this.counterForErrorPV++;

      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.data = "errorReloadService";
      dialogConfig.width = '100%';
      this.setFormDisable(false); 
      this.hiddenAnnulla=true;
      this.dialog.open(PopupErrorComponent,dialogConfig).afterClosed().subscribe(result => {
      const num = 3;
      if(this.counterForErrorPV < num){
        this.getProv();
      }
      else {
        const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.data = "closeAll";
      dialogConfig.width = '100%';
      this.hiddenAnnulla=true;
        this.dialog.open(PopupErrorComponent,dialogConfig).afterClosed().subscribe(result => {
          window.close();
        });
      }
      });
    
  }

  openDialogCM(pv): void{
    this.counterForErrorCM++;
 
       const dialogConfig = new MatDialogConfig();
       dialogConfig.disableClose = true;
       dialogConfig.data = "errorReloadService";
       dialogConfig.width = '100%';
       this.setFormDisable(false); 
       this.hiddenAnnulla=true;
       this.dialog.open(PopupErrorComponent,dialogConfig).afterClosed().subscribe(result => {
       const num = 3;
       if(this.counterForErrorCM < num && pv){
         this.getCom(pv);
       }
       else {
         const dialogConfig = new MatDialogConfig();
       dialogConfig.disableClose = true;
       dialogConfig.data = "closeAll";
       dialogConfig.width = '100%';
       this.hiddenAnnulla=true;
         this.dialog.open(PopupErrorComponent,dialogConfig).afterClosed().subscribe(result => {
           window.close();
         });
       }
       });
     
   }



  openDialogComune(){
    if(this.provinceChosen && this.provinceChosen.description !=='' && this.disabledInModifica){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.id = "comune";
      dialogConfig.height = "100%";
      dialogConfig.width = '100%';
      dialogConfig.data = { 'name': 'listComune', 'province': this.provinceChosen.code};
      this.dialog.open(AutocompleteComponent,dialogConfig).afterClosed().subscribe(response => {
        if(response){
          this.comuneChosen = response["data"];
          this.formdata.controls['commune'].setValue(this.comuneChosen.description.toUpperCase());         
        }
      })
    }
  }

  @HostListener("window:scroll", [])
  onScroll(){
    if(window.scrollY === 0){
      this.visible = false;
    }
    else {
      this.visible = true;
    }
  }

  scrolling(){
    window.scrollBy({top: (window.innerHeight)});
  }

  proseguiConfirmed(){
    alert('CIAONE');
  }

}
