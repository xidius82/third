import { Injectable } from "@angular/core";
import { HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';

@Injectable()
export class SummaryService {

  cm = [
    {catastalcode: "H501D",code: "RM", description: "Roma"},
    {catastalcode: "H501D",code: "RM", description: "Frascati"},
    {catastalcode: "H501D",code: "RM", description: "Guidonia"},
    {catastalcode: "H401D",code: "MI", description: "Milano"},
    {catastalcode: "H401D",code: "MI", description: "Linate"},
  ];

  pv = [
    {code: "RM", description: "Roma"},
    {code: "RM", description: "Frascati"},
    {code: "RM", description: "Guidonia"},
    {code: "MI", description: "Milano"},
    {code: "MI", description: "Linate"},
  ];

  naz = [
    {catastalcode: "",code: "IT", description: "Italia"},
    {catastalcode: "Z200", code: "FR", description: "Francia"}
  ];


  getComuni(prov){
    let body = this.cm.filter(x => x.code === prov);
    return of(new HttpResponse({ status: 200,  body}))

  }

  getNazioni(){
    let body = this.naz;
    return of(new HttpResponse({ status: 200,  body}))

  }

  getProvince(){
    let body = this.pv;
    return of(new HttpResponse({ status: 200,  body}))

  }
}
