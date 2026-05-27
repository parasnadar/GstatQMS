import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { Modal } from 'bootstrap';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { Observable } from 'rxjs';
import { StatusModalComponent } from '../shared/status-modal/status-modal.component';

export const atLeastOneValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const tempNo = control.get('temporaryNo')?.value;
    const gstNo = control.get('gstInNo')?.value;
    // If either has a value, return null (valid)
    return (tempNo && tempNo.trim() !== '') || (gstNo && gstNo.trim() !== '')
      ? null
      : { atLeastOneRequired: true };
  };
};

@Component({
  selector: 'app-token-status',
  imports: [ReactiveFormsModule, CommonModule, StatusModalComponent],
  templateUrl: './token-status.component.html',
  styleUrl: './token-status.component.css',
})
export class TokenStatusComponent {
  tokenStatusForm!: FormGroup;
  modalInstance!: Modal;
  captchaText: string = '';
  captchaToken: any;
  spinerLoader: boolean = false;
  loaderHeading: string = 'Searching Status';
  loaderSubtitle: string = 'Securing your connection to the GSTAT portal...';
  fetchedSlots: any;
  isStatusModalVisible = false;
  statusConfig = { type: 'api-fail' as any, title: '', message: '' };
  loginresponse: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authservice: AuthService,
    private toast: ToastService,
  ) {}

  ngOnInit() {
    this.generateLoginForm();
  }

  ngAfterViewInit() {
    const modalElement = document.getElementById('confirmationModal');
    if (modalElement) {
      // This configuration forces the "bounce" effect and disables ESC key
      this.modalInstance = new Modal(modalElement, {
        backdrop: 'static',
        keyboard: false,
      });
    }
  }

  //Method to build the Login Reactive Form
  generateLoginForm() {
    const captchaRegex = /^[a-zA-Z0-9]{6}$/;
    const gstRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    this.tokenStatusForm = this.formBuilder.group(
      {
        gstInNo: ['', [Validators.pattern(gstRegex)]],
        temporaryNo: [''],
        userCaptcha: [
          '',
          [
            Validators.required,
            Validators.pattern(captchaRegex),
            Validators.minLength(6),
            Validators.maxLength(6),
          ],
        ],
      },
      {
        // Apply the validator to the group
        validators: atLeastOneValidator(),
      },
    );

    this.generateCaptcha();
  }

  // //Method to generate captcha
  // generateCaptcha(): void {
  //   const chars =
  //     'ABCDEFGHIJKLMNOPQRSTUVWXYZadcdefghijklmnopqrstuvwxyz0123456789';
  //   const captchaLength = 6;
  //   let captcha = '';
  //   for (let i = 0; i < captchaLength; i++) {
  //     const index = Math.floor(Math.random() * chars.length);
  //     captcha += chars[index];
  //   }
  //   this.captchaText = captcha;
  //   console.log(this.captchaText);
  // }

  generateCaptcha(): void {
    this.authservice.getCaptcha().subscribe({
      next: (res: any) => {
        this.captchaText = res.resData.captcha;
        this.captchaToken = res.resData.token;
        console.log(res.resData.token);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  startLoader(heading: string, subtitle: string) {
    this.loaderHeading = heading;
    this.loaderSubtitle = subtitle;
    this.spinerLoader = true;
  }

  showStatus(
    type: 'api-fail' | 'server-error' | 'not-found',
    title: string,
    message: string,
  ) {
    this.statusConfig = { type, title, message };
    this.isStatusModalVisible = true;
  }

  isRefreshing = false;

  handleCaptchaRefresh() {
    this.isRefreshing = true;
    this.generateCaptcha();

    // Stop the animation after 800ms (matching the CSS transition)
    setTimeout(() => {
      this.isRefreshing = false;
    }, 800);
  }

  onTokenSubmit() {
    if (this.tokenStatusForm.invalid) {
      this.tokenStatusForm.markAllAsTouched();
      return;
    }

    this.startLoader(
      'Searching Status',
      'Securing your connection to the GSTAT portal...',
    );

    const formValue = this.tokenStatusForm.value;
    const captchaToken = this.captchaToken;
    const captcha = formValue.userCaptcha;

    let searchObservable;

    if (formValue.gstInNo) {
      searchObservable = this.authservice.searchByGstin(
        formValue.gstInNo,
        captchaToken,
        captcha,
      );
    } else {
      searchObservable = this.authservice.searchByTempNo(
        formValue.temporaryNo,
        captchaToken,
        captcha,
      );
    }

    searchObservable.subscribe({
      next: (response) => {
        this.spinerLoader = false;

        if (response.status === 200) {
          if (response.body.status === 200) {
            this.toast.show(response.body.message, 'success');
            this.loginresponse = response.body;
            if (this.loginresponse.resData) {
              this.loginresponse.resData = Array.isArray(
                this.loginresponse.resData,
              )
                ? this.loginresponse.resData
                : [this.loginresponse.resData];
            } else {
              this.loginresponse.resData = []; // Default to empty array if null/undefined
            }
            this.modalInstance.show();
          } else {
            this.toast.show(response.body.message, 'error');
            this.showStatus(
              'not-found',
              'Data Not Found',
              response.body.message || 'No records match the provided details.',
            );
            this.handleFailure();
          }
        } else {
          this.toast.show(response.body.message, 'error');
        }
      },
      error: (err) => {
        this.spinerLoader = false;

        if (err.status === 400) {
          this.toast.show(err.error.message, 'error');
        } else if (err.status === 500) {
          this.showStatus(
            'server-error',
            'Server Issue',
            'The GSTAT portal is experiencing issues. Please try again later.',
          );
        } else {
          this.toast.show(err.error.message, 'error');
        }
        this.handleFailure();
      },
    });
  }

  getStatusClass(status: string): string {
    if (!status) return 'status-default';

    const s = status.toLowerCase();
    switch (s) {
      case 'confirmed':
      case 'active':
        return 'status-success';

      case 'expired':
        return 'status-danger';
      default:
        return 'status-default';
    }
  }

  handleFailure() {
    this.tokenStatusForm.reset();
    this.generateCaptcha();
  }

  onOKBtnSubmit() {
    this.modalInstance.hide();

    const overlay = document.getElementById('page-transition-overlay');

    if (overlay) {
      overlay.classList.add('is-active');

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      window.location.reload();
    }
  }

  onTokenFilingBtnClick() {
    this.router.navigate(['tokenFiling']).then(
      (nav) => {
        console.log(nav); // true if navigation is successful
      },
      (err) => {
        console.log(err); // when there's an error
      },
    );
  }
}
