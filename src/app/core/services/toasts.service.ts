import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class ToastsService {
  private toastr = inject(ToastrService);

  private options(state:string){
    return {
      toastClass:
        `ngx-toastr bg-white border-start border-5 text-success ${state}`,
      titleClass: 'fw-bold toastr-title',
      messageClass: 'text-black toastr-message',
      extendedTimeOut: 1000,
      easing: 'ease-in',
      progressBar: true,
      closeButton: true,
      tapToDismiss: true,
      newestOnTop: false,
    }
  }
  constructor() { }

  success(message:string , title:string){
    this.toastr.success(message,title,this.options('success'));
  }
  error(message:string , title:string){
    this.toastr.error(message,title,this.options('danger'));
  }
}
