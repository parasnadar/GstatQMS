import { Component, OnInit, AfterViewInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Modal } from 'bootstrap';
import { ToastService } from '../services/toast.service';
import { CommonModule } from '@angular/common';
import { StatusModalComponent } from '../shared/status-modal/status-modal.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, StatusModalComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent implements OnInit, AfterViewInit {
  loginForm!: FormGroup;
  slotForm!: FormGroup;
  captchaText: string = '';
  submitted = false;
  spinerLoader: boolean = false;
  loaderHeading: string = 'Verifying GSTIN';
  loaderSubtitle: string = 'Securing your connection to the GSTAT portal...';

  loginresponse: any;
  showOTPMsg: boolean = false; // Changed to boolean
  showThankyouMsg: boolean = false; // Changed to boolean

  modalInstance!: Modal;
  successModalInstance!: Modal;
  isStatusModalVisible = false;
  statusConfig = { type: 'api-fail' as any, title: '', message: '' };

  availableSlots: any[] = [];
  captchaToken: any;
  startTime: any;
  refId: any;
  todayDate: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authservice: AuthService,
    private toast: ToastService,
  ) {
    this.todayDate = new Date().toISOString().split('T')[0];
  }

  ngOnInit() {
    this.generateLoginForm();
    this.getTokenResponse();
    this.generateCaptcha();
    this.generateSlotForm();
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

  ngAfterViewInit(): void {
    // Initialize Modals with 'static' backdrop for the bounce effect
    const modalElement = document.getElementById('confirmationModal');
    if (modalElement) {
      this.modalInstance = new Modal(modalElement, {
        backdrop: 'static',
        keyboard: false,
      });
    }

    const successModalElement = document.getElementById('successModal');
    if (successModalElement) {
      this.successModalInstance = new Modal(successModalElement, {
        backdrop: 'static',
        keyboard: false,
      });
    }
  }

  generateLoginForm() {
    const gstRegex =
      /^(?:[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}|\d{12}TMP)$/;
    const captchaRegex = /^[a-zA-Z0-9]{6}$/;

    this.loginForm = this.formBuilder.group({
      gstInNo: ['', [Validators.required, Validators.pattern(gstRegex)]],
      userCaptcha: [
        '',
        [
          Validators.required,
          Validators.pattern(captchaRegex),
          Validators.minLength(6),
          Validators.maxLength(6),
        ],
      ],
    });
  }

  generateSlotForm() {
    // Added required validators for OTP and Date
    this.slotForm = this.formBuilder.group({
      otp: ['', [Validators.required, Validators.minLength(6)]],
      date: ['', [Validators.required]],
      selectedSlot: ['', [Validators.required]],
    });
    this.slotForm.get('date')?.valueChanges.subscribe((newDate) => {
      if (newDate) {
        const [year, month, day] = newDate.split('-');
        const formattedDate = `${day}-${month}-${year}`;

        this.fetchSlots(formattedDate);
      }
    });
  }

  startLoader(heading: string, subtitle: string) {
    this.loaderHeading = heading;
    this.loaderSubtitle = subtitle;
    this.spinerLoader = true;
  }

  // Helper function to call the modal
  showStatus(
    type: 'api-fail' | 'server-error' | 'not-found',
    title: string,
    message: string,
  ) {
    this.statusConfig = { type, title, message };
    this.isStatusModalVisible = true;
  }

  onLoginSubmit() {
    if (this.loginForm.invalid) {
      return;
    } else {
      this.startLoader(
        'Verifying GSTIN',
        'Securing your connection to the GSTAT portal...',
      );

      const gstNo = this.loginForm.value.gstInNo;
      const captcha = this.loginForm.value.userCaptcha;
      const token = this.captchaToken;

      this.authservice.verifyGst(gstNo, captcha, token).subscribe({
        next: (response) => {
          this.spinerLoader = false;

          if (response.status === 200) {
            if (response.body.status === 200) {
              this.toast.show(
                response.body.message + '      ' + response.body.resData.otp,
                'success',
              );
              this.loginresponse = response.body;
              this.showOTPMsg = true;
              this.generateSlotForm();
            } else {
              this.toast.show(response.body.message, 'error');
              this.showStatus(
                'not-found',
                'Data Not Found',
                response.body.message,
              );
              this.handleFailure();
            }
          } else {
            this.toast.show(response.body.message, 'error');
            // this.handleFailure();
          }
        },
        error: (err) => {
          this.spinerLoader = false;
          if (err.status === 400) {
            this.toast.show(err.error.message, 'error');
          } else if (err.status === 500) {
            this.toast.show(err.error.message, 'error');
          } else if (err.status === 404) {
            this.toast.show(err.error, 'error');
          } else {
            this.toast.show(err.error.message, 'error');
          }

          // this.handleFailure();
        },
      });
    }
  }

  handleFailure() {
    this.loginForm.reset();
    this.generateCaptcha();
  }

  handleResFailure() {
    this.slotForm.reset();
  }

  onSlotSubmit() {
    const modal = document.getElementById('confirmationModal');
    if (modal) modal.classList.add('show-modal');
  }

  onNoBtnSubmit() {
    const modal = document.getElementById('confirmationModal');
    if (modal) modal.classList.remove('show-modal');
  }

  onYesBtnSubmit() {
    const confirmModal = document.getElementById('confirmationModal');
    if (confirmModal) confirmModal.classList.remove('show-modal');

    this.startLoader(
      'Reserving Your Slot',
      'Securing your connection to the GSTAT portal....',
    );

    const gstNo = this.loginresponse.resData.gstNo;

    const startTime = this.startTime;
    const otp = this.slotForm.value.otp;
    const token = this.loginresponse.resData.token;

    const [year, month, day] = this.slotForm.value.date.split('-');
    const date = `${day}-${month}-${year}`;

    this.authservice.confirmSlot(gstNo, date, startTime, otp, token).subscribe({
      next: (response) => {
        this.spinerLoader = false;
        if (response.status === 201) {
          if (response.body.status === 201) {
            this.toast.show(response.body.message, 'success');
            this.refId = response.body.resData;
            // 2. Show the success overlay
            const successModal = document.getElementById('successModal');
            if (successModal) successModal.classList.add('show-modal');
          } else {
            this.toast.show(response.body.message, 'error');
            this.showStatus(
              'not-found',
              'Data Not Found',
              response.body.message || 'No records match the provided details.',
            );
            this.handleResFailure();
          }
        } else {
          this.toast.show(response.body.message, 'error');
          // this.handleResFailure();
        }
      },
      error: (err) => {
        this.spinerLoader = false;
        if (err.status === 400) {
          this.showStatus('api-fail', 'Invalid Input', err.error.message);
        } else if (err.status === 500) {
          this.showStatus('server-error', 'Error', err.error.message);
        } else {
          this.toast.show('Error Please Reload and Try Again', 'error');
        }
        // this.handleResFailure();
      },
    });
  }

  onOKBtnSubmit() {
    const successModal = document.getElementById('successModal');
    if (successModal) successModal.classList.remove('show-modal');

    // Optional: Reset view or navigate
    this.showOTPMsg = false;

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

  getTokenResponse() {
    // Internal method to fetch initial access tokens...
  }

  onCheckTokenStatusBtnClick() {
    this.router.navigate(['tokenStatus']);
  }

  fetchSlots(date: string) {
    this.availableSlots = [];
    this.slotForm.get('selectedSlot')?.reset();

    this.startLoader('Checking Slots', 'Fetching availability...');
    // Format the date if necessary to match DD-MM-YYYY
    this.authservice.getAvailableSlots(date).subscribe({
      next: (response) => {
        this.spinerLoader = false;
        // Check if the body status is 200
        if (response.status === 200) {
          const data = response.body;
          if (data && data.status === 200) {
            this.toast.show(data?.message, 'success');
            this.availableSlots = data.resData || [];
          } else {
            this.toast.show(data?.message || 'Slots not found', 'warning');
          }
        } else {
          this.toast.show(
            response.body.message || 'Slots not found',
            'warning',
          );
        }
      },
      error: (err) => {
        this.spinerLoader = false;
        this.availableSlots = [];
        this.slotForm.get('date')?.reset(null, { emitEvent: false });
        this.toast.show('Server Error: Unable to fetch slots', 'error');
      },
    });
  }

  getSlotClass(status: string): string {
    const s = status.toLowerCase();
    if (s === 'available') return 'available';
    if (s === 'booked') return 'unavailable';
    if (s === 'filling_fast') return 'filling_fast';
    return '';
  }

  selectSlotFromApi(slot: any) {
    if (slot.status === 'BOOKED') return; // Prevent selecting unavailable slots

    // Format the display string: "09:00:00 - 10:00:00"
    const slotRange = `${slot.startTime} - ${slot.endTime}`;
    this.startTime = slot.startTime;
    this.slotForm.patchValue({ selectedSlot: slotRange });
  }
}
