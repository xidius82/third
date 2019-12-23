import { Inject, Injectable } from "@angular/core";
import { HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';

@Injectable()
export class SummaryService {

  questions = [
    {code: "RM", description: "Roma"},
    {code: "RM", description: "Frascati"},
    {code: "RM", description: "Guidonia"},
    {code: "MI", description: "Milano"},
    {code: "MI", description: "Linate"},
];


  getComuni(prov){
    let body = this.questions.filter(x => x.code === prov);
    return of(new HttpResponse({ status: 200,  body}))

  }
}
