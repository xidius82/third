import { modalConstant } from '../constant/modal-constant';

export interface ModalInterface {
  icon?: string;
  title?: string;
  modalTitle?: string;
  modalDescription?: string;
  imgContent?: string;
  modalDescriptionTitle?: string;
  modalBtn?: string;
  exitBtn?: string;
}

export class ModalObject {
  modalTemplate: ModalInterface = {};

  constructor(){}

  getModal(key: string ): ModalInterface {
    this.setModal(key);
    return this.modalTemplate;
  }

  private setModal(key: string){
    this.modalTemplate.icon=modalConstant[key].icon;
    this.modalTemplate.title=modalConstant[key].title;
    this.modalTemplate.modalTitle=modalConstant[key].modalTitle;
    this.modalTemplate.modalDescription=modalConstant[key].modalDescription;
    this.modalTemplate.imgContent=modalConstant[key].imgContent;
    this.modalTemplate.modalDescriptionTitle=modalConstant[key].modalDescriptionTitle;
    this.modalTemplate.modalBtn=modalConstant[key].modalBtn;
    this.modalTemplate.exitBtn=modalConstant[key].exitBtn;

  }
}
