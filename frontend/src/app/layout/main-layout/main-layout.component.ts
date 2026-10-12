import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { filter, Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  unreadNotifications = 0;
  private refreshTimer: ReturnType<typeof setInterval> | null = null;
  private routeSubscription?: Subscription;
  menu = [
    { label: 'Dashboard', path: '/dashboard', access: 'dashboard', short: 'D' },
    { label: 'Projects', path: '/projects', access: 'projectManagement', short: 'P' },
    { label: 'Tasks', path: '/tasks', access: 'taskManagement', short: 'T' },
    { label: 'Employees', path: '/employees', access: 'employeeManagement', short: 'E' },
    { label: 'Reports', path: '/reports', access: 'reports', short: 'R' },
    { label: 'Notifications', path: '/notifications', access: 'notifications', short: 'N' },
    { label: 'File Upload', path: '/file-upload', access: 'fileUpload', short: 'F' },
    { label: 'Settings', path: '/settings', access: 'settings', short: 'S' },
    { label: 'Access Management', path: '/access-management', access: 'accessManagement', short: 'A' }
  ];

  constructor(
    public auth: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadUnreadNotifications();
    this.refreshTimer = setInterval(() => this.loadUnreadNotifications(), 60000);
    this.routeSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.loadUnreadNotifications());
  }

  ngOnDestroy() {
    if (this.refreshTimer) clearInterval(this.refreshTimer);
    this.routeSubscription?.unsubscribe();
  }

  canShow(key: string) {
    return this.auth.canOpen(key);
  }

  switchRole(role: 'admin' | 'user') {
    this.auth.setViewRole(role);
    if (role === 'user') this.router.navigate(['/dashboard']);
    this.loadUnreadNotifications();
  }

  isNotifications(item: any) {
    return item.access === 'notifications';
  }

  loadUnreadNotifications() {
    if (!this.auth.isLoggedIn() || !this.auth.canOpen('notifications')) {
      this.unreadNotifications = 0;
      return;
    }

    this.notificationService.unreadCount().subscribe({
      next: (res) => {
        this.unreadNotifications = res.count || 0;
        this.cdr.detectChanges();
      },
      error: () => {
        this.unreadNotifications = 0;
        this.cdr.detectChanges();
      }
    });
  }
}
