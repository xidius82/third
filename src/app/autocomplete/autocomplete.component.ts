import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { ModalInterface, ModalObject } from '../modals/modal-object';
import { PersonToRegister } from '../interfaces/registration-interface';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { SummaryService } from '../services/summary';
import { User } from '../interfaces/user';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css']
})

export class AutocompleteComponent implements OnInit {

  data: ModalInterface;
  modalObj = new ModalObject;
  personInCache: PersonToRegister;
  input: any;
  city = {
    code: '',
    catastalCode: '',
    description: ''
  };

  constructor(public router: Router, private summaryService: SummaryService,
    private dialogRef: MatDialogRef<AutocompleteComponent>,
    @ViewChild("customAnimation", { static: true}) divAnimation: ElementRef,
    @Inject(MAT_DIALOG_DATA) input
    ) {

      this.input = input;
      this.data = this.setData(this.input.name);

      if( this.input.province ){
        this.city.code = this.input.province;
      }
     }

     formdata = new FormGroup({
       searchTerm : new FormControl(null)
     });

     filteredOptions : Observable<User[]>;
     searchResult: Array<any>;
     select: Array<any>;


  ngOnInit() {
    const timeoutAnimationStart = 100;
    setTimeout(() => {
      this.dialogRef.addPanelClass('custom-animation-open');
    }, timeoutAnimationStart);

    if (this.dialogRef.id === 'nazione'){
      this.select = this.input.lista;
      this.searchResult = this.select;
      this.formdata.valueChanges.subscribe((search) => {
        this.searchResult = this._filter(search.searchTerm);
      });
    } else if (this.dialogRef.id === 'provincia'){
      this.select = this.input.lista;
      this.searchResult = this.select;
      this.formdata.valueChanges.subscribe((search) => {
        this.searchResult = this._filter(search.searchTerm);
      });
    }else if (this.dialogRef.id === 'comune'){
      this.searchResult = this.select;
      this.summaryService.getComuni(this.city.code).subscribe(res => {
        this.select = Array.from(res['lista']);
        this.formdata.valueChanges.subscribe((search) => {
          this.searchResult = this._filter(search.searchTerm);
        });
      });


  }

}

closeDialog(){
  const timeoutAnimationEnd = 0;
  this.dialogRef.removePanelClass('custom-animation-open');
  setTimeout(() => {
    this.dialogRef.close();
  }, timeoutAnimationEnd);
}

closeDialogAndSave(item){
  this.city = item;
  const timeoutAnimationEnd = 0;
  this.dialogRef.removePanelClass('custom-animation-open');
  setTimeout(() => {
    this.dialogRef.close({ data: this.city
    });
  }, timeoutAnimationEnd);
}

setData(key:  string): ModalInterface{
  return this.modalObj.getModal(key);
}

private _filter(name: string): User[] {
  const filterValue = name.toLocaleLowerCase();
  return this.select.filter(s => s.description.toLocaleLowerCase().indexOf(filterValue) === 0);
}

}
