import { Injectable, Inject } from "@angular/core";
import { SESSION_STORAGE, WebStorageService } from 'angular-webstorage-service';

@Injectable()
export class CacheFormService {

  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService){

  }

  public data: Object;

  loadData(key){
    return this.storage.get(key);
  }

  saveData(key, val){
    this.storage.set(key, val);
  }

  clearData(key){
    this.storage.remove(key);
  }

}
