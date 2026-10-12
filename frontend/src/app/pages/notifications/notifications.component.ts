import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications: any[] = [];
  loading = false;
  error = '';
  constructor(private notificationService: NotificationService, private cdr: ChangeDetectorRef) {}
  ngOnInit() { this.load(); }
  load() {
    this.loading = true;
    this.error = '';
    this.notificationService.list().subscribe({
      next: (res) => {
        this.notifications = Array.isArray(res) ? res : [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || 'Unable to load notifications.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
  read(id: string) { this.notificationService.read(id).subscribe(() => this.load()); }
  remove(id: string) { this.notificationService.delete(id).subscribe(() => this.load()); }
  clear() { if (confirm('Clear all notifications?')) this.notificationService.clear().subscribe(() => this.load()); }
}
