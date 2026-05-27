import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ToastData {
  message: string;
  type: 'success' | 'warning' | 'error';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toastState = new Subject<ToastData | null>();

  show(message: string, type: 'success' | 'warning' | 'error' = 'success') {
    this.toastState.next({ message, type });

    // Auto-hide after 4 seconds
    setTimeout(() => {
      this.toastState.next(null);
    }, 4000);
  }
}
