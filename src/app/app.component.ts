import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; // Required for async pipe and ngClass
import { ToastService, ToastData } from './services/toast.service'; // Ensure path is correct
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Filling-Token';

  // Create an observable to be used with the async pipe in the template
  toast$: Observable<ToastData | null>;
  isClosing = false;

  constructor(private toastService: ToastService) {
    this.toast$ = this.toastService.toastState.asObservable();
  }

  closeToast() {
    this.isClosing = true;
    setTimeout(() => {
      this.toastService.toastState.next(null);

      // 3. Reset the flag for the next toast
      this.isClosing = false;
    }, 500);
  }
}
