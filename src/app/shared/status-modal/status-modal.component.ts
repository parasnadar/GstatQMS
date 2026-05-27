import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-modal',
  templateUrl: './status-modal.component.html',
  imports: [CommonModule],
  styleUrls: ['./status-modal.component.css'],
})
export class StatusModalComponent {
  @Input() isVisible: boolean = false;
  @Input() type: 'api-fail' | 'server-error' | 'not-found' = 'api-fail';
  @Input() title: string = 'System Alert';
  @Input() message: string = '';

  @Output() onClose = new EventEmitter<void>();

  dismiss() {
    this.isVisible = false;
    this.onClose.emit();
  }
}
