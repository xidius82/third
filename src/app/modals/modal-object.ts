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
  modalTemplate: ModalInterface = {
    icon: '',
    title: '',
    modalTitle:'',
    modalDescription: '',
    imgContent: '',
    modalDescriptionTitle: '',
    modalBtn: '',
    exitBtn: '',
  };

  getModal(key: string ): ModalInterface {
    this.setModal(key);
    return this.modalTemplate;
  }

  private setModal(key: string){


    this.modalTemplate.icon="";
    this.modalTemplate.title= "<span id='canvas'>ciao</span>";
    this.modalTemplate.modalTitle= "comuni";
    this.modalTemplate.modalDescription= "comuni";
    this.modalTemplate.imgContent= "comuni";
    this.modalTemplate.modalDescriptionTitle="comuni";
    this.modalTemplate.modalBtn= "comuni";
    this.modalTemplate.exitBtn="";

  }
}
