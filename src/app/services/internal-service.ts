import { Injectable } from "@angular/core";
import { PersonToRegister } from '../interfaces/registration-interface';
import { CacheFormService } from './cache-form';

@Injectable()
export class InternalService {
  private keyStructure = "REGISTRATION-FORM";

  constructor(private cache: CacheFormService){}

  clearDataRegistrationForm(): void {
    this.cache.clearData(this.keyStructure);
  }

  loadDataRegistrationForm(): PersonToRegister {
    return <PersonToRegister> this.cache.loadData(this.keyStructure);

  }

  saveDataRegistrationForm(persona: PersonToRegister): void {
    let personaToCache = persona;
    let dataInCache = this.loadDataRegistrationForm();
    if (dataInCache){
      personaToCache = this.updateObjectToCache(persona, this.loadDataRegistrationForm);
    }

    this.cache.saveData(this.keyStructure, personaToCache);

  }

  updateObjectToCache(itemToInsert, itemToUpdate): any {
    for (let key in itemToInsert){
      itemToUpdate[key] = itemToInsert[key];
    }
    return itemToUpdate;
  }
}
