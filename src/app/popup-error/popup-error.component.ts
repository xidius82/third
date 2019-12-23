import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { ModalInterface, ModalObject } from '../modals/modal-object';;
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-popup-error',
  templateUrl: './popup-error.component.html',
  styleUrls: ['./popup-error.component.css']
})
export class PopupErrorComponent implements OnInit {

  data: ModalInterface;
  modalObj = new ModalObject;
  @ViewChild("customAnimation", { static: true}) divAnimation: ElementRef;


  constructor(public router: Router, private dialogRef: MatDialogRef<PopupErrorComponent>,

    @Inject(MAT_DIALOG_DATA) input
    ) {
    this.data = this.setData(input);
    }


  ngOnInit() {
    const timeoutAnimationStart = 100;
    setTimeout(() => {
      this.dialogRef.addPanelClass('custom-animation-open');
    }, timeoutAnimationStart);

   }

   setData(key:  string): ModalInterface{
    return this.modalObj.getModal(key);
  }

closeDialog(){
  const timeoutAnimationEnd = 0;
  this.dialogRef.removePanelClass('custom-animation-open');
  setTimeout(() => {
    this.dialogRef.close();
  }, timeoutAnimationEnd);
}

}

