import { Component, OnInit, ElementRef, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { ModalObject } from 'src/app/modals/modal-object';
import { SanitizeHtmlPipe } from 'src/app/pipes/sanitize';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-first',
  templateUrl: './first.component.html',
  styleUrls: ['./first.component.css']
})
export class FirstComponent implements OnInit, AfterViewInit {
  ngAfterViewInit(): void {
    this.elRef.nativeElement.querySelector("#canvas").addEventListener('click', this.call.bind(this));
  }

  ciao;

  constructor(private domSanitizer:DomSanitizer, private elRef:ElementRef, private cdRef:ChangeDetectorRef) { }

   modalObject= new  ModalObject();
   pipe = new SanitizeHtmlPipe(this.domSanitizer);

  ngOnInit() {
    let temp = this.modalObject.getModal('errorReloadService');
    this.ciao = this.pipe.transform(temp.title);
    }

  call(){
    alert('ciaooo');
  }

}
